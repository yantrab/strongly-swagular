import { PanelDetails } from "../../domain/panel/panel.details";
import { DbService, Repository } from "../db/db.service";
export class PanelService {
  private panelDetailsRepo: Repository<PanelDetails>;
  constructor(private dbService: DbService) {
    this.panelDetailsRepo = this.dbService.getRepository(PanelDetails, "panels");
  }

  getPanelList(userId?: string) {
    return this.panelDetailsRepo.find(userId ? { userId } : {});
  }

  saveOrUpdatePanel(panel: PanelDetails) {
    return this.panelDetailsRepo.saveOrUpdateOne(panel);
  }
}
