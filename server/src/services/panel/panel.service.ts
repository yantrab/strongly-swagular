import { ActionType, PanelDetails } from "../../domain/panel/panel.details";
import { DbService, Repository } from "../db/db.service";
import { ChangeItem, Contact, Contacts, Source } from "../../domain/panel/panel.contacts";
import { dumps } from "../../domain/panel/initial-damps";
import { Panel } from "../../domain/panel/panel";
import { assignWith, cloneDeep } from "lodash";
import { getContactsChanges } from "../../../../shared/panel";

export class PanelService {
  private panelDetailsRepo: Repository<PanelDetails>;
  private panelContactsRepo: Repository<Contacts>;
  constructor(private dbService: DbService) {
    this.panelDetailsRepo = this.dbService.getRepository(PanelDetails, "panels");
    this.panelContactsRepo = this.dbService.getRepository(Contacts, "panels");
    this.panelDetailsRepo.collection.createIndex({ panelId: 1 }, { unique: true }).then(() => {});
    this.panelContactsRepo.collection.createIndex({ panelId: 1 }, { unique: true }).then(() => {});
  }

  getPanelList(userId?: string) {
    return this.panelDetailsRepo.find(userId ? { userId } : {});
  }

  async getPanelDetails(panelId: number) {
    return this.panelDetailsRepo.findOne({ panelId: panelId });
  }

  async getPanel(panelDetails: PanelDetails) {
    const contacts = await this.getPanelContacts(panelDetails.panelId);
    if (!contacts) throw "contacts missing for panel " + panelDetails.panelId;
    return new Panel({ contacts: contacts, details: panelDetails });
  }

  saveOrUpdatePanel(panel: PanelDetails) {
    return this.panelDetailsRepo.saveOrUpdateOne(panel);
  }

  async addNewPanel(panel: PanelDetails) {
    panel.status = ActionType.idle;
    const savedPanel = await this.saveOrUpdatePanel(panel);
    const initialPanel = new Panel({ details: panel }).reDump(dumps.MP[panel.direction]);
    await this.panelContactsRepo.saveOrUpdateOne({ panelId: panel.panelId, list: initialPanel.contacts.list, changes: [] });
    return savedPanel;
  }

  async getPanelContacts(panelId: number) {
    return this.panelContactsRepo.findOne({ panelId: panelId });
  }

  updateContact(panelId: number, contact: Contact, changes: ChangeItem[]) {
    return this.panelContactsRepo.collection.updateOne(
      { panelId, "list.index": contact.index },
      { $set: { "list.$": contact }, $push: { changes: { $each: changes } } }
    );
  }

  updateContacts(panelId: number, contacts: Contact[], changes?: ChangeItem[]) {
    return this.panelContactsRepo.collection.updateOne({ panelId }, { $set: { list: contacts, changes } });
  }

  setContactsChanges(panelId: number, changes: ChangeItem[]) {
    return this.panelContactsRepo.collection.updateOne({ panelId }, { $set: { changes } });
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
    return { contacts: panel.contacts };
  }

  async reset(id: number) {
    const panel = (await this.getPanelDetails(id))!;
    const initialPanel = new Panel({ details: panel }).reDump(dumps.MP[panel.direction]);
    await this.panelContactsRepo.collection.deleteOne({ panelId: id });
    await this.panelContactsRepo.saveOrUpdateOne({ panelId: panel.panelId, list: initialPanel.contacts.list, changes: [] });
    return { contacts: initialPanel.contacts };
  }
}
