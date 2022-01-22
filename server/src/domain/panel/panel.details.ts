import { Entity } from "../entity";
import { numberString } from "strongly";

enum Lang {
  he = "Hebrew",
  en = "English"
}

export enum ActionType {
  idle = "000",
  status = "6",
  nameOrder = "777",
  powerUp = "888",

  writeAllToPanel = "222",
  writeAllToPanelInProgress = "10",

  writeToPanel = "444",
  writeToPanelInProgress = "12",

  readAllFromPanel = "333",
  readAllFromPanelInProgress = "13",

  writeToPanelCanceled = "RRR",
  readAllFromPanelCanceled = "SSS",

  nameOrderCanceled = "TTT",
  powerUpCanceled = "808"
}

export class PanelDetails extends Entity<PanelDetails> {
  @numberString phoneNumber: string;
  address?: string;
  contactName?: string;
  contactPhone?: string;

  direction: Lang;
  panelId: number;
  userId: string;
  status: ActionType;
  lastConnection?: number;
  progressPst?: number;
  code: number;
}

export class AddPanelDetailsDTO {
  id: number;
  @numberString phoneNumber: string;
  address: string;
  contactName?: string;
  contactPhone?: string;

  direction: Lang;
  panelId: number;

  code: number;
}
