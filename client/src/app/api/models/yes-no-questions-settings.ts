import { YesNo } from './yes-no';
export interface YesNoQuestionsSettings {
  apartmentS: YesNo;
  atoZ: YesNo;
  buzOnRlZ: YesNo;
  closeDoorMes: YesNo;
  detectorBL: YesNo;
  directDial: YesNo;
  displayTelVaL: YesNo;
  doorForgetMes: YesNo;
  elevatorCnT: YesNo;
  entryMessage: YesNo;
  externalPxY: YesNo;
  fullMenu: YesNo;
  nameAnnounce: YesNo;
  noApNoOf: YesNo;
  openDoorMe: YesNo;
  proxy1R1: YesNo;
  proxy1R2: YesNo;
  proxy2R1: YesNo;
  proxy2R2: YesNo;
  proxyNpiN: YesNo;
  ringingMes: YesNo;
  stageMessage: YesNo;
  usingRTC: YesNo;
  welcomeByDet: YesNo;
}

export const YesNoQuestionsSettingsSchema  = {"type":"object","properties":{"apartmentS":{"$ref":"#/components/schemas/YesNo"},"detectorBL":{"$ref":"#/components/schemas/YesNo"},"proxy1R1":{"$ref":"#/components/schemas/YesNo"},"proxy1R2":{"$ref":"#/components/schemas/YesNo"},"proxy2R1":{"$ref":"#/components/schemas/YesNo"},"proxy2R2":{"$ref":"#/components/schemas/YesNo"},"proxyNpiN":{"$ref":"#/components/schemas/YesNo"},"atoZ":{"$ref":"#/components/schemas/YesNo"},"externalPxY":{"$ref":"#/components/schemas/YesNo"},"elevatorCnT":{"$ref":"#/components/schemas/YesNo"},"usingRTC":{"$ref":"#/components/schemas/YesNo"},"displayTelVaL":{"$ref":"#/components/schemas/YesNo"},"buzOnRlZ":{"$ref":"#/components/schemas/YesNo"},"noApNoOf":{"$ref":"#/components/schemas/YesNo"},"directDial":{"$ref":"#/components/schemas/YesNo"},"fullMenu":{"$ref":"#/components/schemas/YesNo"},"entryMessage":{"$ref":"#/components/schemas/YesNo"},"stageMessage":{"$ref":"#/components/schemas/YesNo"},"closeDoorMes":{"$ref":"#/components/schemas/YesNo"},"nameAnnounce":{"$ref":"#/components/schemas/YesNo"},"doorForgetMes":{"$ref":"#/components/schemas/YesNo"},"welcomeByDet":{"$ref":"#/components/schemas/YesNo"},"ringingMes":{"$ref":"#/components/schemas/YesNo"},"openDoorMe":{"$ref":"#/components/schemas/YesNo"}},"required":["apartmentS","detectorBL","proxy1R1","proxy1R2","proxy2R1","proxy2R2","proxyNpiN","atoZ","externalPxY","elevatorCnT","usingRTC","displayTelVaL","buzOnRlZ","noApNoOf","directDial","fullMenu","entryMessage","stageMessage","closeDoorMes","nameAnnounce","doorForgetMes","welcomeByDet","ringingMes","openDoorMe"]}
