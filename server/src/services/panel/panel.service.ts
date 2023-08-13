import { ActionType, PanelDetails } from "../../domain/panel/panel.details";
import { DbService, Repository } from "../db/db.service";
import { ChangeItem, Contact, Contacts, Source } from "../../domain/panel/panel.contacts";
import { dumps } from "../../domain/panel/initial-damps";
import { Panel, panelPropertiesSetting } from "../../domain/panel/panel";
import { cloneDeep } from "lodash";
import { getContactsChanges } from "../../../../shared/panel";
import { Settings, SettingsChangeItem } from "../../domain/panel/settings";
import { SmsService } from "../sms.service";

export class PanelService {
  private panelDetailsRepo: Repository<PanelDetails>;
  private panelContactsRepo: Repository<Contacts>;
  private panelSettingsRepo: Repository<Settings>;

  constructor(private dbService: DbService, private smsService: SmsService) {
    this.panelDetailsRepo = this.dbService.getRepository(PanelDetails, "panels");
    this.panelContactsRepo = this.dbService.getRepository(Contacts, "panels");
    this.panelSettingsRepo = this.dbService.getRepository(Settings, "panels");
    this.panelDetailsRepo.collection.createIndex({ panelId: 1 }, { unique: true }).then(() => {});
    this.panelContactsRepo.collection.createIndex({ panelId: 1 }, { unique: true }).then(() => {});
  }

  getPanelList(userId?: string) {
    return this.panelDetailsRepo.find(userId ? { userId } : {});
  }

  async deletePanel(panelId: number) {
    try {
      await this.panelDetailsRepo.collection.deleteOne({ panelId });
      await this.panelContactsRepo.collection.deleteOne({ panelId });
      await this.panelSettingsRepo.collection.deleteOne({ panelId });
      return true;
    } catch (error) {}
  }

  async getPanelDetails(panelId: number) {
    return this.panelDetailsRepo.findOne({ panelId: panelId });
  }

  async getPanel(panelDetails: PanelDetails) {
    const contacts = await this.getPanelContacts(panelDetails.panelId);
    if (!contacts) throw "contacts missing for panel " + panelDetails.panelId;

    const settings = await this.getPanelSettings(panelDetails.panelId);
    if (!settings) throw "settings missing for panel " + panelDetails.panelId;
    return new Panel({ contacts, settings, details: panelDetails });
  }

  saveOrUpdatePanel(panel: PanelDetails) {
    return this.panelDetailsRepo.saveOrUpdateOne(panel);
  }

  // async resetChanges(panelDetails: PanelDetails) {
  //   const panel = await this.getPanel(panelDetails);
  //   panel.settings.changes?.forEach(c => {
  //     set(panel.settings, c.path, c.previewsValue);
  //   });
  //
  //   panel.contacts.changes?.forEach(c => {
  //     set(panel.contacts.list[c.index], c.key, c.previewsValue);
  //   });
  //
  //   await this.updateContacts(panel.details.panelId, panel.contacts.list, []);
  //   await this.updateSettings(panel.details.panelId, panel.settings, []);
  // }

  async addNewPanel(panel: PanelDetails) {
    panel.status = ActionType.idle;
    const savedPanel = await this.saveOrUpdatePanel(panel);
    const initialPanel = new Panel({ details: panel }).reDump(dumps.MP[panel.direction]);
    await this.panelContactsRepo.saveOrUpdateOne(initialPanel.contacts);
    await this.panelSettingsRepo.saveOrUpdateOne(initialPanel.settings);
    return savedPanel;
  }

  async getPanelContacts(panelId: number) {
    return this.panelContactsRepo.findOne({ panelId: panelId });
  }

  async getPanelSettings(panelId: number) {
    return this.panelSettingsRepo.findOne({ panelId: panelId });
  }

  updateContact(panelId: number, contact: Contact, changes: ChangeItem[]) {
    return this.panelContactsRepo.collection.updateOne(
      { panelId, "list.index": contact.index },
      { $set: { "list.$": contact }, $push: { changes: { $each: changes } } }
    );
  }

  updateSettings(panelId: number, settings: any, changes: SettingsChangeItem[]) {
    return this.panelSettingsRepo.collection.updateOne({ panelId }, { $set: { ...settings, changes } });
  }

  updateContacts(panelId: number, contacts: Contact[], changes?: ChangeItem[]) {
    return this.panelContactsRepo.collection.updateOne({ panelId }, { $set: { list: contacts, changes } });
  }

  setContactsChanges(panelId: number, changes: ChangeItem[]) {
    return this.panelContactsRepo.collection.updateOne({ panelId }, { $set: { changes } });
  }

  setSettingsChanges(panelId: number, changes: SettingsChangeItem[]) {
    return this.panelSettingsRepo.collection.updateOne({ panelId }, { $set: { changes } });
  }

  async dump(panelDetails: PanelDetails) {
    return (await this.getPanel(panelDetails)).dump();
  }

  async reDump(panelDetails: PanelDetails, dump: string) {
    const panel = await this.getPanel(panelDetails);
    const oldPanel = cloneDeep(panel);
    panel.reDump(dump);
    panel.contacts.changes = panel.contacts.changes || [];
    panel.contacts.changes = panel.contacts.changes.concat(getContactsChanges(panel.contacts.list, oldPanel.contacts.list, Source.client));
    await this.updateContacts(panelDetails.panelId, panel.contacts.list, panel.contacts.changes);

    // settings
    panel.settings.changes = panel.settings.changes || [];
    Object.keys(panelPropertiesSetting.settings).forEach(key => {
      Object.keys(panelPropertiesSetting.settings[key]).forEach(prop => {
        const oldValue = oldPanel.settings[key][prop];
        const newValue = panel.settings[key][prop];
        if (oldValue !== newValue) {
          panel.settings.changes.push({
            path: `${key}.${prop}`,
            source: Source.client,
            previewsValue: oldValue,
          });
        }
      });
    });

    return { contacts: panel.contacts, settings: panel.settings };
  }

  async reset(id: number) {
    const panel = (await this.getPanelDetails(id))!;
    const initialPanel = new Panel({ details: panel }).reDump(dumps.MP[panel.direction]);
    await this.panelContactsRepo.collection.deleteOne({ panelId: id });
    await this.panelContactsRepo.saveOrUpdateOne({
      panelId: panel.panelId,
      list: initialPanel.contacts.list,
      changes: [],
    });

    await this.panelSettingsRepo.collection.deleteOne({ panelId: id });
    await this.panelSettingsRepo.saveOrUpdateOne(initialPanel.settings);
    return { contacts: initialPanel.contacts, settings: initialPanel.settings };
  }

  async purge(id: number) {
    await this.panelContactsRepo.collection.deleteOne({ panelId: id });
    await this.panelSettingsRepo.collection.deleteOne({ panelId: id });
    await this.panelDetailsRepo.collection.deleteOne({ panelId: id });
  }

  openPanel(panel: PanelDetails) {
    this.smsService.send(panel.phoneNumber, `${panel.code || "123456"}srvon`).then(x => {
      console.log(x);
    });
  }
}
