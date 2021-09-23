import { createServer } from "net";
import { LoggerService } from "../loggerService";
import { Buffer } from "buffer";
import { PanelService } from "./panel.service";
import { ActionType, PanelDetails } from "../../domain/panel/panel.details";
import { Panel, panelPropertiesSetting } from "../../domain/panel/panel";
import { Source } from "../../domain/panel/panel.contacts";

const SOCKET_TIMEOUT = 1000 * 30;

interface Action {
  type: ActionType;
  pId: number;
  data: any;
}

const statusMap = {};
statusMap[ActionType.idle] = "000";
statusMap[ActionType.readAllFromPanelCanceled] = "SSS";
export class PanelSocketService {
  constructor(private logger: LoggerService, private panelService: PanelService) {}

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
        socket.on("data", async msg => {
          try {
            timeOut.refresh();
            const action = this.buildAction(msg);
            const panel = await this.panelService.getPanel(action.pId);
            if (!panel) return socket.write("999");
            let result;
            switch (action.type) {
              case ActionType.readAllFromPanel:
                if (panel.status === ActionType.readAllFromPanelCanceled) {
                  result = statusMap[ActionType.readAllFromPanelCanceled];
                } else {
                  result = await this.updateFromPanel(panel, action, 16);
                }
                break;
              case ActionType.status:
                result = await this.getStatus(action as any, panel);
                break;
            }
            let buffer = Buffer.from(result, "utf8");
            for (let i = 0; i < buffer.length; i++) {
              if (buffer[i] < 171 && buffer[i] > 143) {
                buffer = Buffer.concat([buffer.slice(0, i - 1), new Buffer([buffer[i] + 16]), buffer.slice(i + 1, buffer.length + 1)]);
              }
            }

            return socket.write(buffer);
          } catch (e) {
            //this.sentMsg(action.pId, { from: "server", e }, "log");
            this.logError("err.message " + port + ".", socket.address, e).then();
            socket.write("100");
            socket.end();
          }
        });
      });
  }

  async getStatus(action: Action & { d }, panelDetails: PanelDetails): Promise<string> {
    const status = panelDetails.status;
    if (status === ActionType.writeToPanel) {
      const panel = await this.getPanel(panelDetails);
      let nextChange = panel.contacts.changes.find(c => c.previewsValue !== undefined && c.source === Source.client);

      if (action.d && nextChange) {
        nextChange.previewsValue = undefined;
        await this.panelService.setContactsChanges(panelDetails.panelId, panel.contacts.changes);
        nextChange = panel.contacts.changes.find(c => c.previewsValue !== undefined && c.source === Source.client);
      }

      if (!nextChange) {
        panelDetails.status = ActionType.idle;
        await this.panelService.saveOrUpdatePanel(panelDetails);
      } else {
        const newValue = panel.contacts.list[nextChange.index][nextChange.key];
        const indexSettings = panelPropertiesSetting.contacts[nextChange.key];
        const index = indexSettings.index + indexSettings.length * nextChange.index;
        return "04" + ("0".repeat(10) + index).slice(-10) + newValue;
      }
    }

    return statusMap[panelDetails.status];
  }

  buildAction(buffer: Buffer): Action {
    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i] < 187 && buffer[i] > 159) {
        buffer = Buffer.concat([buffer.slice(0, i), new Buffer([215, buffer[i] - 16]), buffer.slice(i + 1, buffer.length + 1)]);
        i++;
      }
    }

    const msg = buffer.toString("utf8");
    return msg[0] !== "!"
      ? JSON.parse(msg)
      : {
          pId: msg.slice(1, 16),
          type: ActionType.readAllFromPanel,
          data: { start: +msg.slice(16, 21), data: msg.slice(24) }
        };
  }

  private logError(msg, hostname?, args?) {
    const log = { msg, ...args, time: +new Date(), level: 51 };
    return this.logger.write(JSON.stringify(log));
  }

  private logInfo(msg, hostname?, args?) {
    const log = { msg, ...args, time: +new Date(), level: 31 };
    return this.logger.write(JSON.stringify(log));
  }
  private async getPanel(panelDetails: PanelDetails) {
    const contacts = await this.panelService.getPanelContacts(panelDetails.panelId);
    if (!contacts) throw "contacts missing for panel " + panelDetails.panelId;
    return new Panel({ contacts: contacts, details: panelDetails });
  }

  private async updateFromPanel(panelDetails: PanelDetails, action: Action, multiply = 1) {
    action.data.start = +action.data.start;
    if (panelDetails.status !== ActionType.readAllFromPanelInProgress) {
      panelDetails.status = ActionType.readAllFromPanelInProgress;
      // this.sentMsg(action.pId, panel.actionType, "status");
      await this.panelService.saveOrUpdatePanel(panelDetails);
    }
    const panel = await this.getPanel(panelDetails);
    const dump = panel.dump().split("");
    const start = action.data.start * multiply;
    const length = action.data.data.length;
    //const oldDump = panel.dump();
    for (let i = start; i < start + length; i++) {
      dump[i] = "^";
    }
    // this.signChanges(panel, oldDump, dump.join(""), Source.Panel, panel.contacts.changesList);
    for (let i = start; i < start + length; i++) {
      const value = action.data.data[i - start];
      if (value === String.fromCharCode(0)) {
        for (let j = i; j < start + length; j++) {
          dump[j] = " ";
        }
        break;
      }
      dump[i] = value;
    }
    panel.reDump(dump.join(""));
    await this.panelService.updateContacts(panelDetails.panelId, panel.contacts.list);
    // this.sentMsg(action.pId, "", "write");

    return "111";
  }
}
