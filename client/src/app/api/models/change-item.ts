import { Source } from './source';
export interface ChangeItem {
  index: number;
  key: string;
  previewsValue?: string;
  source: Source;
}

export const ChangeItemSchema  = {"type":"object","properties":{"index":{"type":"number"},"key":{"type":"string"},"previewsValue":{"type":"string"},"source":{"$ref":"#/components/schemas/Source"}},"required":["index","key","source"]}
