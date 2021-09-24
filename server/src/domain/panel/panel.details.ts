import { Entity } from "../entity";

enum Lang {
  he = "Hebrew",
  en = "English"
}
export enum ActionType {
  idle = "000",
  // readAll = 2,
  // writeAllToPanel = 3,
  writeToPanel = "444",
  readAllFromPanel = "555",
  status = "666",
  nameOrder = "777",
  powerUp = "888",
  // writeAllProgress = 10,
  // readAllProgress = 11,

  writeToPanelInProgress = 12,
  readAllFromPanelInProgress = 13,

  writeToPanelCanceled = "RRR",
  readAllFromPanelCanceled = "SSS",
  nameOrderCanceled = "TTT",
  powerUpCanceled = "808"
}

export class PanelDetails extends Entity<PanelDetails> {
  phoneNumber: number;
  address?: string;
  contactName?: string;
  contactPhone?: number;

  direction: Lang;
  panelId: number;
  userId: string;
  status: ActionType;
  lastConnection?: number;
}

export class AddPanelDetailsDTO {
  id: number;
  phoneNumber: number;
  address?: string;
  contactName?: string;
  contactPhone?: number;

  direction: Lang;
  panelId: number;
}
