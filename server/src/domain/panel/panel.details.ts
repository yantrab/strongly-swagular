import { Entity } from "../entity";

enum Lang {
  he = "Hebrew",
  en = "English"
}
export enum ActionType {
  idle = 0,
  // readAll = 2,
  // writeAllToPanel = 3,
  writeToPanel = 4,
  readAllFromPanel = 5,
  status = 6,
  nameOrder = 7,
  powerUp = 8,
  // writeAllProgress = 10,
  // readAllProgress = 11,

  writeToPanelInProgress = 12,
  readAllFromPanelInProgress = 13,

  writeToPanelCanceled = 14,
  readAllFromPanelCanceled = 15
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
