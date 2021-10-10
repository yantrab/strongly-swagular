export enum ActionType {
  idle = '000',
  writeToPanel = '444',
  readAllFromPanel = '555',
  status = '666',
  nameOrder = '777',
  powerUp = '888',
  writeToPanelInProgress = '12',
  readAllFromPanelInProgress = '13',
  writeToPanelCanceled = 'RRR',
  readAllFromPanelCanceled = 'SSS',
  nameOrderCanceled = 'TTT',
  powerUpCanceled = '808'
}

export const ActionTypeSchema  = {"enum":["000","444","555","666","777","888",12,13,"RRR","SSS","TTT","808"],"x-enumNames":["idle","writeToPanel","readAllFromPanel","status","nameOrder","powerUp","writeToPanelInProgress","readAllFromPanelInProgress","writeToPanelCanceled","readAllFromPanelCanceled","nameOrderCanceled","powerUpCanceled"],"type":"string"}
