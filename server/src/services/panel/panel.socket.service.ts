import { createServer } from "net";
import { LoggerService } from "../loggerService";
import { Buffer } from "buffer";
import { PanelService } from "./panel.service";
import { ActionType, PanelDetails } from "../../domain/panel/panel.details";
import { panelPropertiesSetting } from "../../domain/panel/panel";
import { ChangeItem, Source } from "../../domain/panel/panel.contacts";
import { cloneDeep, get } from "lodash";
import { WebSocketService } from "../sokcet/socket.service";
import { SettingsChangeItem } from "../../domain/panel/settings";

const SOCKET_TIMEOUT = 1000 * 30;

interface Action {
  type: ActionType;
  pId: number;
  data: any;
}

export class PanelSocketService {
  constructor(private logger: LoggerService, private panelService: PanelService, private readonly webSocketService: WebSocketService) {}
  sentMsg(id: number, action: string, data: any) {
    this.webSocketService?.io.to("panel_" + id).emit(action, data);
  }

  listen() {
    const port = 4000;
    const host = "0.0.0.0";
    const server = createServer();

    server
      .listen(port, host, () => {
        this.logInfo("TCP Server is running on port " + port + ".").then();
      })
      .on("error", err => {
        this.logError("err.message " + port + ".", undefined, err).then();
      })
      .on("end", _ => {
        this.logInfo("Socket end" + port + ".", host).then();
      })
      .on("connection", socket => {
        this.logInfo("CONNECTED", socket.address).then();
        const timeOut = setTimeout(() => {
          socket.end();
          this.logInfo("force close client connection!", socket.address).then();
        }, SOCKET_TIMEOUT);

        socket.on("close", _ => {
          this.logInfo("DISCONNECTED" + port + ".", socket.address).then();
        });
        socket.on("error", err => {
          this.logError("err.message " + port + ".", socket.address, err).then();
        });
        socket.on("data", async (msg: Buffer) => {
          const msgString = msg.toString();
          timeOut.refresh();
          const action = this.buildAction(msg);
          try {
            this.logInfo("panel answered", host, {
              req: msgString,
              buffer: msg,
              pId: action.pId,
              type: action.type,
              data: JSON.stringify(action.data || {})
            }).then();

            const panel = await this.panelService.getPanelDetails(action.pId);
            if (!panel) return socket.write("999");
            let result;
            switch (action.type) {
              case ActionType.readAllFromPanel:
                if (panel.status === ActionType.readAllFromPanelCanceled || panel.status === ActionType.idle) {
                  result = ActionType.readAllFromPanelCanceled.toString();
                } else {
                  result = await this.updateFromPanel(panel, action);
                }
                break;
              case ActionType.writeAllToPanel:
                if (panel.status === ActionType.writeToPanelCanceled || panel.status === ActionType.idle) {
                  result = ActionType.writeToPanelCanceled;
                } else {
                  result = await this.writeToPanel(panel, action);
                }
                break;
              case ActionType.status:
                result = await this.getStatus(action as any, panel);
                break;
            }
            panel.lastConnection = +new Date();
            await this.panelService.saveOrUpdatePanel(panel);
            this.sentMsg(panel.panelId, "panelUpdate", panel);
            let buffer = Buffer.from(result, "utf8");
            for (let i = 0; i < buffer.length; i++) {
              if (buffer[i] < 171 && buffer[i] > 143) {
                buffer = Buffer.concat([buffer.slice(0, i - 1), new Buffer([buffer[i] + 16]), buffer.slice(i + 1, buffer.length + 1)]);
              }
            }
            const resultString = buffer.toString();
            this.logInfo("panel answered", host, {
              res: resultString,
              pId: action.pId
            }).then();
            return socket.write(buffer);
          } catch (e) {
            this.logError("err.message " + port + ".", socket.address, { ...e, pId: action.pId }).then();
            socket.write("100");
            socket.end();
          }
        });
      });
  }

  private async getStatus(action: Action & { d }, panelDetails: PanelDetails): Promise<string> {
    const status = panelDetails.status;
    if (status === ActionType.writeToPanel || status === ActionType.writeToPanelInProgress) {
      const panel = await this.panelService.getPanel(panelDetails);
      const getNextChange = () =>
        panel.contacts.changes.find(c => c.previewsValue !== null && c.source === Source.client) ||
        panel.settings.changes.find(c => c.previewsValue !== null && c.source === Source.client);
      let nextChange = getNextChange();
      let isContactChanges = (nextChange as any)["key"];
      if (action.d && nextChange) {
        if (status === ActionType.writeToPanel) {
          panelDetails.status = ActionType.writeToPanelInProgress;
        }
        (nextChange as any).previewsValue = null;
        nextChange.source = Source.Panel;
        if (isContactChanges) {
          await this.panelService.setContactsChanges(panelDetails.panelId, panel.contacts.changes);
        } else {
          await this.panelService.setSettingsChanges(panelDetails.panelId, panel.settings.changes);
        }
        nextChange = getNextChange();
        panelDetails.progressPst = Math.floor(
          ((panel.settings.changes.filter(c => c.previewsValue === null).length +
            panel.contacts.changes.filter(c => c.previewsValue === null).length) /
            (panel.settings.changes.length + panel.contacts.changes.length)) *
            100
        );
      }

      if (!nextChange) {
        panelDetails.progressPst = 100;
        panelDetails.status = ActionType.idle;
        await this.panelService.setContactsChanges(panelDetails.panelId, []);
        await this.panelService.setSettingsChanges(panelDetails.panelId, []);
      } else {
        isContactChanges = (nextChange as any)["key"];
        let indexSettings: { index: number; length: number };
        nextChange.source = Source.PanelProgress;
        let index: number;
        if (isContactChanges) {
          nextChange = nextChange as ChangeItem;
          indexSettings = panelPropertiesSetting.contacts[nextChange.key];
          index = indexSettings.index + indexSettings.length * nextChange.index;
          this.sentMsg(action.pId, "updateContacts", panel.contacts);
        } else {
          nextChange = nextChange as SettingsChangeItem;
          indexSettings = get(panelPropertiesSetting.settings, nextChange.path);
          index = indexSettings.index;
          this.sentMsg(action.pId, "updateSettings", panel.settings);
        }
        const newValue = panel.dump().slice(index, index + indexSettings.length);
        return "04" + ("0".repeat(10) + index).slice(-10) + newValue;
      }

      this.sentMsg(action.pId, "updateContacts", panel.contacts);
    } else if (action.d) {
      panelDetails.status = ActionType.idle;
      panelDetails.progressPst = 100;
      await this.panelService.setContactsChanges(panelDetails.panelId, []);
      await this.panelService.setSettingsChanges(panelDetails.panelId, []);

      if (status === ActionType.readAllFromPanelInProgress) {
        return ActionType.readAllFromPanelCanceled;
      }
    }

    if (status === ActionType.writeAllToPanelInProgress) {
      panelDetails.progressPst = 100;
      panelDetails.status = ActionType.idle;
      await this.panelService.setContactsChanges(panelDetails.panelId, []);
      await this.panelService.setSettingsChanges(panelDetails.panelId, []);
    }

    if (status === ActionType.readAllFromPanelInProgress) {
      return ActionType.readAllFromPanel;
    }

    return panelDetails.status.toString();
  }

  private async updateFromPanel(panelDetails: PanelDetails, action: Action) {
    if (panelDetails.status !== ActionType.readAllFromPanelInProgress) {
      panelDetails.status = ActionType.readAllFromPanelInProgress;
    }
    panelDetails.progressPst = panelDetails.progressPst || 1;
    if (panelDetails.progressPst + 6 < 100) panelDetails.progressPst += 3;
    const panel = await this.panelService.getPanel(panelDetails);
    const oldPanel = cloneDeep(panel);
    const dump = panel.dump().split("");
    const start = action.data.start;
    const length = action.data.data.length;
    const world = action.data.data
      .split("")
      .map(a => ((a.charCodeAt(0) > 176 && a.charCodeAt(0) < 1488) || a.charCodeAt(0) > 1514 ? " " : a))
      .join("");
    for (let i = start; i < start + length; i++) {
      dump[i] = "^";
    }
    for (let i = start; i < start + length; i++) {
      const value = world[i - start];
      if (value === String.fromCharCode(0)) {
        for (let j = i; j < start + length; j++) {
          dump[j] = " ";
        }
        break;
      }
      dump[i] = value;
    }
    panel.reDump(dump.join(""));

    panel.contacts.list.forEach((c, i) => {
      Object.keys(c).forEach(key => {
        if (c[key] !== oldPanel.contacts.list[i][key]) {
          panel.contacts.changes.push({ source: Source.Panel, index: i, key } as any);
        }
      });
    });
    await this.panelService.updateContacts(panelDetails.panelId, panel.contacts.list, panel.contacts.changes);
    this.sentMsg(action.pId, "updateContacts", panel.contacts);
    this.sentMsg(action.pId, "updateSettings", panel.settings);
    return "111";
  }

  private async writeToPanel(panelDetails: PanelDetails, action: Action) {
    if (panelDetails.status !== ActionType.writeAllToPanelInProgress) {
      panelDetails.status = ActionType.writeAllToPanelInProgress;
    }
    panelDetails.progressPst = panelDetails.progressPst || 1;
    if (panelDetails.progressPst + 2 < 100) panelDetails.progressPst += 1.5;
    const panel = await this.panelService.getPanel(panelDetails);
    const dump = panel.dump();
    const start = action.data.start;
    const length = action.data.length;
    return "S" + dump.slice(start, start + length);
  }

  private buildAction(buffer: Buffer): Action {
    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i] < 187 && buffer[i] > 159) {
        buffer = Buffer.concat([buffer.slice(0, i), new Buffer([215, buffer[i] - 16]), buffer.slice(i + 1, buffer.length + 1)]);
        i++;
      }
    }
    const msg = buffer.toString("utf8");
    const result =
      msg[0] !== "!"
        ? JSON.parse(msg)
        : {
            pId: msg.slice(1, 16),
            type: ActionType.readAllFromPanel,
            data: { start: +msg.slice(16, 21), data: msg.slice(24) }
          };
    result.pId = +result.pId;
    if (result.data?.start) {
      result.data.start = +result.data.start;
      result.data.length = +result.data.length;
    }
    if (result.type === 4) {
      result.type = "222";
    }
    return result;
  }

  private logError(msg, hostname?, args?) {
    const log = { msg, ...args, time: +new Date(), level: 51 };
    return this.logger.write(JSON.stringify(log));
  }

  private logInfo(msg, hostname?, args?) {
    const log = { msg, ...args, time: +new Date(), level: 31 };
    return this.logger.write(JSON.stringify(log));
  }
}
