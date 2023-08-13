import { FloorValueSettings } from './floor-value-settings';
import { GeneralSettings } from './general-settings';
import { SettingsChangeItem } from './settings-change-item';
import { TimingSettings } from './timing-settings';
import { YesNoQuestionsSettings } from './yes-no-questions-settings';
export interface Settings {
  '_id'?: string;
  '_isDeleted'?: boolean;
  changes: Array<SettingsChangeItem>;
  floor: FloorValueSettings;
  general: GeneralSettings;
  panelId: number;
  timing: TimingSettings;
  yesNo: YesNoQuestionsSettings;
}

export const SettingsSchema  = {"type":"object","properties":{"general":{"$ref":"#/components/schemas/GeneralSettings"},"timing":{"$ref":"#/components/schemas/TimingSettings"},"yesNo":{"$ref":"#/components/schemas/YesNoQuestionsSettings"},"floor":{"$ref":"#/components/schemas/FloorValueSettings"},"changes":{"type":"array","items":{"$ref":"#/components/schemas/SettingsChangeItem"}},"panelId":{"type":"number"},"_id":{"type":"string"},"_isDeleted":{"type":"boolean"}},"required":["general","timing","yesNo","floor","changes","panelId"]}
