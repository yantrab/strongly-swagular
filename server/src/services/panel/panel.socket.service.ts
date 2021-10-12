import { createServer } from "net";
import { LoggerService } from "../loggerService";
import { Buffer } from "buffer";
import { PanelService } from "./panel.service";
import { ActionType, PanelDetails } from "../../domain/panel/panel.details";
import { panelPropertiesSetting } from "../../domain/panel/panel";
import { Source } from "../../domain/panel/panel.contacts";
import { cloneDeep } from "lodash";
import { WebSocketService } from "../sokcet/socket.service";

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
          try {
            const msgString = msg.toString();
            timeOut.refresh();
            const action = this.buildAction(msg);
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
            this.logInfo("panel answered", host, { panel: msgString, server: resultString }).then();
            return socket.write(buffer);
          } catch (e) {
            this.logError("err.message " + port + ".", socket.address, e).then();
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
      const getNextChange = () => panel.contacts.changes.find(c => c.previewsValue !== null && c.source === Source.client) as any;
      let nextChange = getNextChange();

      if (action.d && nextChange) {
        if (status === ActionType.writeToPanel) {
          panelDetails.status = ActionType.writeToPanelInProgress;
        }
        (nextChange as any).previewsValue = null;
        nextChange.source = Source.Panel;
        await this.panelService.setContactsChanges(panelDetails.panelId, panel.contacts.changes);
        nextChange = getNextChange();
      }

      if (!nextChange) {
        panelDetails.status = ActionType.idle;
      } else {
        nextChange.source = Source.PanelProgress;
        this.sentMsg(action.pId, "updateContacts", panel.contacts);
        const newValue = panel.contacts.list[nextChange.index][nextChange.key];
        const indexSettings = panelPropertiesSetting.contacts[nextChange.key];
        const index = indexSettings.index + indexSettings.length * nextChange.index;
        return "04" + ("0".repeat(10) + index).slice(-10) + newValue;
      }

      this.sentMsg(action.pId, "updateContacts", panel.contacts);
      if (!panel.contacts.changes.find(c => c.previewsValue)) {
        await this.panelService.setContactsChanges(panelDetails.panelId, []);
      }
    } else if (action.d) {
      if (panelDetails.status === ActionType.writeToPanelInProgress) {
        await this.panelService.setContactsChanges(panelDetails.panelId, []);
      }
      panelDetails.status = ActionType.idle;
    }

    return panelDetails.status.toString();
  }

  private async updateFromPanel(panelDetails: PanelDetails, action: Action) {
    action.data.start = +action.data.start;
    if (panelDetails.status !== ActionType.readAllFromPanelInProgress) {
      panelDetails.msgCount = 0;
      panelDetails.status = ActionType.readAllFromPanelInProgress;
    }
    panelDetails.msgCount!++;
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
          panel.contacts.changes.push({ source: Source.Panel, index: i, key, previewsValue: null } as any);
        }
      });
    });
    await this.panelService.updateContacts(panelDetails.panelId, panel.contacts.list, panel.contacts.changes);
    this.sentMsg(action.pId, "updateContacts", panel.contacts);
    return "111";
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
