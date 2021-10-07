import { suite, test } from "@testdeck/jest";
import "reflect-metadata";
import { app } from "./app";
import { PanelService } from "./services/panel/panel.service";
import { inject } from "strongly";
import { Lang } from "../../client/src/app/api/models/lang";
import { ActionType, PanelDetails } from "./domain/panel/panel.details";
import { Socket } from "net";
import { Source } from "./domain/panel/panel.contacts";

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
    this.panel = { panelId: 1, direction: Lang.en, userId: "1", status: ActionType.idle, phoneNumber: 1 };
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
    const registerActionD = { type: ActionType.status, pId: "1", d: 1 };
    const registerActionStringD = JSON.stringify(registerActionD);

    expect(await this.write(registerActionString)).toBe("000");

    this.panel.status = ActionType.readAllFromPanel;
    await this.panelService.saveOrUpdatePanel(this.panel);
    expect(await this.write(registerActionString)).toBe("555");
    expect(await this.write(registerActionStringD)).toBe("000");

    this.panelService.updateContact(1, { index: 0, apartment: "11", name1: "name", tel1: "111", ref: "22" }, [
      { index: 0, previewsValue: "a", source: Source.client, key: "name1" },
      { index: 0, previewsValue: "a", source: Source.client, key: "apartment" },
      { index: 0, previewsValue: "a", source: Source.client, key: "tel1" }
    ]);
    this.panel.status = ActionType.writeToPanel;
    await this.panelService.saveOrUpdatePanel(this.panel);
    expect(await this.write(registerActionString)).toBe("040000002551name"); // name
    expect(await this.write(registerActionStringD)).toBe("04000003563111"); //apartment
    expect(await this.write(registerActionStringD)).toBe("040000036382111"); //tel1
    expect(await this.write(registerActionStringD)).toBe("000");

    this.panelService.updateContact(1, { index: 0, apartment: "11", name1: "name", tel1: "111", ref: "22" }, [
      { index: 0, previewsValue: "a", source: Source.client, key: "name1" },
      { index: 0, previewsValue: "a", source: Source.client, key: "apartment" },
      { index: 0, previewsValue: "a", source: Source.client, key: "tel1" }
    ]);
    this.panel.status = ActionType.writeToPanel;
    await this.panelService.saveOrUpdatePanel(this.panel);
    expect(await this.write(registerActionString)).toBe("040000002551name"); // name
    this.panel.status = ActionType.writeToPanelCanceled;
    await this.panelService.saveOrUpdatePanel(this.panel);
    expect(await this.write(registerActionString)).toBe("RRR");
    expect(await this.write(registerActionStringD)).toBe("000");
  }
  @test
  async readFromPanel() {
    this.panel.status = ActionType.readAllFromPanelCanceled;
    await this.panelService.saveOrUpdatePanel(this.panel);
    const command = "!00000000000000102551555aaaaaaaaaaaa";
    const result = await this.write(command);
    expect(result).toBe("SSS");

    this.panel.status = ActionType.readAllFromPanel;
    await this.panelService.saveOrUpdatePanel(this.panel);
    const result2 = await this.write(command);
    expect(result2).toBe("111");
    expect((await this.panelService.getPanelContacts(1))?.list[0].name1).toBe("aaaaaaaaaaaa");

    const result3 = await this.write("!00000000000000102551555aaaa����aaaa    ");
    expect(result3).toBe("111");
    const p = await this.panelService.getPanelContacts(1);
    expect(p?.list[0].name1).toBe("aaaa    aaaa");
    expect(p?.changes[0]).toStrictEqual({ index: 0, key: "name1", source: 0 });
  }

  // @test
  // async s() {
  //   const registerAction = { type: ActionType.status, pId: "1" };
  //   const registerActionString = JSON.stringify(registerAction);
  //   const registerActionD = { type: ActionType.status, pId: "1", d: 1 };
  //   const registerActionStringD = JSON.stringify(registerActionD);
  //
  //   await this.write(registerActionString);
  // }
}
