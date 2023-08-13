export interface TimingSettings {
  RingingNum: number;
  breakBetweenRings: number;
  busyBeforeHang: number;
  busyFreQ: number;
  busyLvL: number;
  busyRing: number;
  busyTone1: number;
  busyTone2: number;
  cameraT: number;
  confirm: number;
  delayT: number;
  delayT2: number;
  detAnN: number;
  doorT: number;
  doorT2: number;
  fDooR: number;
  floorAnn: number;
  highRingFreq: number;
  illuminationT: number;
  lowRingFreq: number;
  nameAnN: number;
  nameList: number;
  proxyT: number;
  ringT: number;
  ringsToMovE: number;
  selClear: number;
  selName: number;
  speech: number;
}

export const TimingSettingsSchema  = {"type":"object","properties":{"delayT":{"type":"number","minimum":0,"maximum":99},"doorT":{"type":"number","minimum":0,"maximum":99},"delayT2":{"type":"number","minimum":0,"maximum":99},"doorT2":{"type":"number","minimum":0,"maximum":99},"illuminationT":{"type":"number","minimum":0,"maximum":99},"ringT":{"type":"number","minimum":0,"maximum":99},"cameraT":{"type":"number","minimum":0,"maximum":99},"proxyT":{"type":"number","minimum":0,"maximum":99},"fDooR":{"type":"number","minimum":0,"maximum":99},"detAnN":{"type":"number","minimum":0,"maximum":99},"nameAnN":{"type":"number","minimum":0,"maximum":99},"floorAnn":{"type":"number","minimum":0,"maximum":99},"nameList":{"type":"number","minimum":0,"maximum":99},"selName":{"type":"number","minimum":0,"maximum":99},"selClear":{"type":"number","minimum":0,"maximum":99},"speech":{"type":"number","minimum":0,"maximum":99},"busyRing":{"type":"number","minimum":0,"maximum":99},"confirm":{"type":"number","minimum":0,"maximum":99},"RingingNum":{"type":"number","minimum":0,"maximum":99},"busyTone1":{"type":"number","minimum":0,"maximum":99},"busyTone2":{"type":"number","minimum":0,"maximum":99},"busyLvL":{"type":"number","minimum":0,"maximum":99},"busyFreQ":{"type":"number","minimum":0,"maximum":99},"lowRingFreq":{"type":"number","minimum":0,"maximum":99},"highRingFreq":{"type":"number","minimum":0,"maximum":99},"breakBetweenRings":{"type":"number","minimum":0,"maximum":99},"ringsToMovE":{"type":"number","minimum":0,"maximum":99},"busyBeforeHang":{"type":"number","minimum":0,"maximum":99}},"required":["delayT","doorT","delayT2","doorT2","illuminationT","ringT","cameraT","proxyT","fDooR","detAnN","nameAnN","floorAnn","nameList","selName","selClear","speech","busyRing","confirm","RingingNum","busyTone1","busyTone2","busyLvL","busyFreQ","lowRingFreq","highRingFreq","breakBetweenRings","ringsToMovE","busyBeforeHang"]}
