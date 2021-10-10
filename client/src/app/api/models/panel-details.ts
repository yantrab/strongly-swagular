import { ActionType } from './action-type';
import { Lang } from './lang';
export interface PanelDetails {
  '_id'?: string;
  '_isDeleted'?: boolean;
  address?: string;
  contactName?: string;
  contactPhone?: number;
  direction: Lang;
  lastConnection?: number;
  panelId: number;
  phoneNumber: number;
  status: ActionType;
  userId: string;
}

export const PanelDetailsSchema  = {"type":"object","properties":{"phoneNumber":{"type":"number"},"address":{"type":"string"},"contactName":{"type":"string"},"contactPhone":{"type":"number"},"direction":{"$ref":"#/components/schemas/Lang"},"panelId":{"type":"number"},"userId":{"type":"string"},"status":{"$ref":"#/components/schemas/ActionType"},"lastConnection":{"type":"number"},"_id":{"type":"string"},"_isDeleted":{"type":"boolean"}},"required":["phoneNumber","direction","panelId","userId","status"]}
