import { Entity } from "../entity";

enum Lang {
  he = "Hebrew",
  en = "English"
}

export class PanelDetails extends Entity<PanelDetails> {
  phoneNumber: number;
  address?: string;
  contactName?: string;
  contactPhone?: number;

  direction: Lang;
  panelId: number;
  userId: string;
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
