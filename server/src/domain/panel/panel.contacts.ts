import { max, numberString, pattern } from "strongly";
import { panel } from "../../../../shared/panel";
import { Entity } from "../entity";
const phonePattern = /^[0-9f\-*#]*$/g;
export class Contact {
  index: number;
  @max(panel.contacts.name1.length) name1: string;
  @max(panel.contacts.name2.length) name2?: string;
  @max(panel.contacts.tel1.length) @pattern(phonePattern) tel1: string;
  @max(panel.contacts.tel2.length) @pattern(phonePattern) tel2?: string;
  @max(panel.contacts.tel3.length) @pattern(phonePattern) tel3?: string;
  @max(panel.contacts.tel4.length) @pattern(phonePattern) tel4?: string;
  @max(panel.contacts.tel5.length) @pattern(phonePattern) tel5?: string;
  @max(panel.contacts.tel6.length) @pattern(phonePattern) tel6?: string;
  @max(panel.contacts.code.length) @numberString code?: string;
  @max(panel.contacts.ref.length) @numberString ref: string;
  @max(panel.contacts.apartment.length) @numberString apartment: string;
}

export class Contacts extends Entity<Contacts> {
  list: Contact[];
  panelId: number;
}
