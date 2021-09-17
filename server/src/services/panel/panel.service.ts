import { PanelDetails } from "../../domain/panel/panel.details";
import { DbService, Repository } from "../db/db.service";
import { Contact, Contacts } from "../../domain/panel/panel.contacts";
import { reDump } from "../../../../shared/panel";
import { dumps } from "./initial-damps";
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

  saveOrUpdatePanel(panel: PanelDetails) {
    return this.panelDetailsRepo.saveOrUpdateOne(panel);
  }

  async addNewPanel(panel: PanelDetails) {
    const savedPanel = await this.saveOrUpdatePanel(panel);
    const initialPanel = reDump(dumps.MP[panel.direction], panel.direction);
    await this.panelContactsRepo.saveOrUpdateOne({ panelId: panel.panelId, list: initialPanel.contacts });
    return savedPanel;
  }

  async getPanelContacts(panelId: number) {
    return (await this.panelContactsRepo.findOne({ panelId: panelId }))?.list;
  }

  updateContact(panelId: number, contact: Contact) {
    return this.panelContactsRepo.collection.updateOne({ panelId, "list.index": contact.index }, { $set: { "list.$": contact } });
  }
}
