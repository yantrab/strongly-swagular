import { Source } from './source';
export interface SettingsChangeItem {
  path: string;
  previewsValue: any;
  source: Source;
}

export const SettingsChangeItemSchema  = {"type":"object","properties":{"path":{"type":"string"},"previewsValue":{},"source":{"$ref":"#/components/schemas/Source"}},"required":["path","previewsValue","source"]}
