import { Entity } from "../entity";

enum Lang {
  he = "Hebrew",
  en = "English"
}
export enum ActionType {
  idle = "000",
  status = "666",
  nameOrder = "777",
  powerUp = "888",

  writeAllToPanel = "333",
  writeAllToPanelInProgress = 10,

  writeToPanel = "444",
  writeToPanelInProgress = 12,

  readAllFromPanel = "555",
  readAllFromPanelInProgress = 13,

  writeToPanelCanceled = "RRR",
  readAllFromPanelCanceled = "SSS",

  nameOrderCanceled = "TTT",
  powerUpCanceled = "808"
}

export class PanelDetails extends Entity<PanelDetails> {
  phoneNumber: string;
  address?: string;
  contactName?: string;
  contactPhone?: string;

  direction: Lang;
  panelId: number;
  userId: string;
  status: ActionType;
  lastConnection?: number;
  msgCount?: number;
}

export class AddPanelDetailsDTO {
  id: number;
  phoneNumber: string;
  address: string;
  contactName?: string;
  contactPhone?: string;

  direction: Lang;
  panelId: number;
}
