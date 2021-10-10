import { Lang } from './lang';
export interface AddPanelDetailsDto {
  address: string;
  contactName?: string;
  contactPhone?: number;
  direction: Lang;
  id: number;
  panelId: number;
  phoneNumber: number;
}

export const AddPanelDetailsDtoSchema  = {"type":"object","properties":{"id":{"type":"number"},"phoneNumber":{"type":"number"},"address":{"type":"string"},"contactName":{"type":"string"},"contactPhone":{"type":"number"},"direction":{"$ref":"#/components/schemas/Lang"},"panelId":{"type":"number"}},"required":["id","phoneNumber","address","direction","panelId"]}
