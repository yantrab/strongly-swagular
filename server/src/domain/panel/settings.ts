import { Entity } from "../entity";
import { Source } from "./panel.contacts";
import { max, min, numberString, pattern } from "strongly";
export enum YesNo {
  No = "N",
  Yes = "Y"
}
export class GeneralSettings {
  @numberString @max(10) masterCode: string;
  @numberString @max(10) tecUserCode: string;
  @min(0) @max(99) extKeys: number;
  @min(0) @max(9) fastStep: number;
  @min(0) @max(9999) offset: number;
  @min(0) @max(9) commSpd: number;
  @min(0) @max(9) familyNo: number;
  @min(0) @max(250) relay1MeM: number;
  @min(0) @max(250) relay2MeM: number;
  @min(0) @max(7) speechLevel: number;
  @pattern(/^[0-9\-]$/g) toneCode1: string;
  @pattern(/^[0-9\-]$/g) toneCode2: string;
  @pattern(/^[0-7\-]$/g) confirmTone: string;

  // @numberString @max(16) dialer1: string;
  // @numberString @max(16) dialer2: string;
  // @numberString @max(16) relay1: string;
  // @numberString @max(16) relay2: string;
}

export class TimingSettings {
  @min(0) @max(99) delayT: number;
  @min(0) @max(99) doorT: number;
  @min(0) @max(99) delayT2: number;
  @min(0) @max(99) doorT2: number;
  @min(0) @max(99) illuminationT: number;
  @min(0) @max(99) ringT: number;
  @min(0) @max(99) cameraT: number;
  @min(0) @max(99) proxyT: number;
  @min(0) @max(99) fDooR: number;
  @min(0) @max(99) detAnN: number;
  @min(0) @max(99) nameAnN: number;
  @min(0) @max(99) floorAnn: number;
  @min(0) @max(99) nameList: number;
  @min(0) @max(99) selName: number;
  @min(0) @max(99) selClear: number;
  @min(0) @max(99) speech: number;
  @min(0) @max(99) busyRing: number;
  @min(0) @max(99) confirm: number;
  @min(0) @max(99) RingingNum: number;
  @min(0) @max(99) busyTone1: number;
  @min(0) @max(99) busyTone2: number;
  @min(0) @max(99) busyLvL: number;
  @min(0) @max(99) busyFreQ: number;
  @min(0) @max(99) lowRingFreq: number;
  @min(0) @max(99) highRingFreq: number;
  @min(0) @max(99) breakBetweenRings: number;
  @min(0) @max(99) ringsToMovE: number;
  @min(0) @max(99) busyBeforeHang: number;
}

export class YesNoQuestionsSettings {
  apartmentS: YesNo;
  detectorBL: YesNo;
  proxy1R1: YesNo;
  proxy1R2: YesNo;
  proxy2R1: YesNo;
  proxy2R2: YesNo;
  proxyNpiN: YesNo;
  atoZ: YesNo;
  externalPxY: YesNo;
  elevatorCnT: YesNo;
  usingRTC: YesNo;
  displayTelVaL: YesNo;
  buzOnRlZ: YesNo;
  noApNoOf: YesNo;
  directDial: YesNo;
  fullMenu: YesNo;

  entryMessage: YesNo;
  stageMessage: YesNo;
  closeDoorMes: YesNo;
  nameAnnounce: YesNo;
  doorForgetMes: YesNo;
  welcomeByDet: YesNo;
  ringingMes: YesNo;
  openDoorMe: YesNo;
}

export class FloorValueSettings {
  @min(0) @max(250) floorValue1: number;
  @min(0) @max(250) floorValue2: number;
  @min(0) @max(250) floorValue3: number;
  @min(0) @max(250) floorValue4: number;
  @min(0) @max(250) floorValue5: number;
  @min(0) @max(250) floorValue6: number;
  @min(0) @max(250) floorValue7: number;
  @min(0) @max(250) floorValue8: number;
  @min(0) @max(250) floorValue9: number;
  @min(0) @max(250) floorValue10: number;
  @min(0) @max(250) floorValue11: number;
  @min(0) @max(250) floorValue12: number;
  @min(0) @max(250) floorValue13: number;
  @min(0) @max(250) floorValue14: number;
  @min(0) @max(250) floorValue15: number;
  @min(0) @max(250) floorValue16: number;
  @min(0) @max(250) floorValue17: number;
  @min(0) @max(250) floorValue18: number;
  @min(0) @max(250) floorValue19: number;
  @min(0) @max(250) floorValue20: number;
  @min(0) @max(250) floorValue21: number;
  @min(0) @max(250) floorValue22: number;
  @min(0) @max(250) floorValue23: number;
  @min(0) @max(250) floorValue24: number;
  @min(0) @max(250) floorValue25: number;
  @min(0) @max(250) floorValue26: number;
  @min(0) @max(250) floorValue27: number;
  @min(0) @max(250) floorValue28: number;
  @min(0) @max(250) floorValue29: number;
  @min(0) @max(250) floorValue30: number;
}
interface SettingsChangeItem {
  path: string;
  previewsValue?: any;
  source: Source;
}
export class Settings extends Entity<Settings> {
  general: GeneralSettings;
  timing: TimingSettings;
  yesNo: YesNoQuestionsSettings;
  floor: FloorValueSettings;
  changes: SettingsChangeItem[];
  panelId: number;
}
