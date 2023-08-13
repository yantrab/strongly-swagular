import { ChangeItem } from './change-item';
import { Contact } from './contact';
export interface Contacts {
  '_id'?: string;
  '_isDeleted'?: boolean;
  changes: Array<ChangeItem>;
  list: Array<Contact>;
  panelId: number;
}

export const ContactsSchema  = {"type":"object","properties":{"list":{"type":"array","items":{"$ref":"#/components/schemas/Contact"}},"changes":{"type":"array","items":{"$ref":"#/components/schemas/ChangeItem"}},"panelId":{"type":"number"},"_id":{"type":"string"},"_isDeleted":{"type":"boolean"}},"required":["list","changes","panelId"]}
