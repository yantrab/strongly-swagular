import { ActionType, PanelDetails } from "../../domain/panel/panel.details";
import { DbService, Repository } from "../db/db.service";
import { ChangeItem, Contact, Contacts } from "../../domain/panel/panel.contacts";
import { dumps } from "../../domain/panel/initial-damps";
import { Panel } from "../../domain/panel/panel";

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

  async getPanel(panelId: number) {
    return this.panelDetailsRepo.findOne({ panelId: panelId });
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
    return this.panelContactsRepo.collection.updateOne({ panelId }, { $set: { list: contacts } });
  }

  setContactsChanges(panelId: number, changes: ChangeItem[]) {
    return this.panelContactsRepo.collection.updateOne({ panelId }, { $set: { changes } });
  }
}
