import { suite, test } from "@testdeck/jest";
import "reflect-metadata";
import { FastifyInstance } from "fastify";
import { app } from "./app";
import { PanelService } from "./services/panel/panel.service";
import { inject } from "strongly";
import { Lang } from "../../client/src/app/api/models/lang";
import { ActionType, PanelDetails } from "./domain/panel/panel.details";
import { Socket } from "net";
const port = 4000;
const pId = "1"; //'861311009983668'; //'1'//
const host = "localhost"; //'128.199.41.162'; //'178.62.237.25' //'

@suite
class AppSpec {
  panelService: PanelService;
  panel: PanelDetails;
  static async before() {
    await app();
  }
  async before() {
    this.panel = { panelId: 1, direction: Lang.he, userId: "1", status: ActionType.idle, phoneNumber: 1 };
    this.panelService = await inject(PanelService);
    // @ts-ignore
    await this.panelService.panelDetailsRepo.collection.deleteMany({});
    // @ts-ignore
    await this.panelService.panelContactsRepo.collection.deleteMany({});
    await this.panelService.addNewPanel(this.panel);
  }
  write = async (str: string) => {
    return new Promise(resolve => {
      const client = new Socket();
      client.setMaxListeners(100);

      client.connect(port, host, function() {
        client.write(str);
        client.on("data", data => {
          client.end();
          client.on("close", () => {
            console.log(data.toString());
            return resolve(data.toString());
          });
        });
      });
    });
  };

  @test
  async statusPanelNotExist() {
    const registerAction = { type: ActionType.status, pId: "-1" };
    const registerActionString = JSON.stringify(registerAction);
    expect(await this.write(registerActionString)).toBe("999");
  }

  @test
  async status() {
    const registerAction = { type: ActionType.status, pId: "1" };
    const registerActionString = JSON.stringify(registerAction);
    expect(await this.write(registerActionString)).toBe("000");
  }
}
