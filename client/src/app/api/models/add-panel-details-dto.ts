import { Lang } from './lang';
export interface AddPanelDetailsDto {
  address: string;
  contactName?: string;
  contactPhone?: string;
  direction: Lang;
  id: number;
  panelId: number;
  phoneNumber: string;
}

export const AddPanelDetailsDtoSchema  = {"type":"object","properties":{"id":{"type":"number"},"phoneNumber":{"type":"string","pattern":"^[0-9]*$"},"address":{"type":"string"},"contactName":{"type":"string"},"contactPhone":{"type":"string"},"direction":{"$ref":"#/components/schemas/Lang"},"panelId":{"type":"number"}},"required":["id","phoneNumber","address","direction","panelId"]}
