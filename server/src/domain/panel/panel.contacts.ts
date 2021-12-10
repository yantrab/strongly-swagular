import { max, numberString } from "strongly";
import { Entity } from "../entity";
import { panelPropertiesSetting } from "./panel";

export class Contact {
  index: number;
  @max(13) name1?: string;
  @max(13) name2?: string;
  @max(panelPropertiesSetting.contacts.tel1.length) @numberString tel1?: string;
  @max(panelPropertiesSetting.contacts.tel2.length) @numberString tel2?: string;
  @max(panelPropertiesSetting.contacts.tel3.length) @numberString tel3?: string;
  // @max(panelPropertiesSetting.contacts.tel4.length) @pattern(phonePattern) tel4?: string;
  // @max(panelPropertiesSetting.contacts.tel5.length) @pattern(phonePattern) tel5?: string;
  // @max(panelPropertiesSetting.contacts.tel6.length) @pattern(phonePattern) tel6?: string;
  @max(panelPropertiesSetting.contacts.code.length) @numberString code?: string;
  @max(panelPropertiesSetting.contacts.ref.length) @numberString ref: string;
  @max(panelPropertiesSetting.contacts.apartment.length) @numberString apartment: string;
}

export class ChangeItem {
  index: number;
  key: string;
  previewsValue?: string;
  source: Source;
}

export enum Source {
  Panel,
  client,
  PanelProgress
}

export class Contacts extends Entity<Contacts> {
  list: Contact[];
  changes: ChangeItem[];
  panelId: number;
}
