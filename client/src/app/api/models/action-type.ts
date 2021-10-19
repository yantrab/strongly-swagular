export enum ActionType {
  idle = '000',
  status = '666',
  nameOrder = '777',
  powerUp = '888',
  writeAllToPanel = '333',
  writeAllToPanelInProgress = '10',
  writeToPanel = '444',
  writeToPanelInProgress = '12',
  readAllFromPanel = '555',
  readAllFromPanelInProgress = '13',
  writeToPanelCanceled = 'RRR',
  readAllFromPanelCanceled = 'SSS',
  nameOrderCanceled = 'TTT',
  powerUpCanceled = '808'
}

export const ActionTypeSchema  = {"enum":["000","666","777","888","333",10,"444",12,"555",13,"RRR","SSS","TTT","808"],"x-enumNames":["idle","status","nameOrder","powerUp","writeAllToPanel","writeAllToPanelInProgress","writeToPanel","writeToPanelInProgress","readAllFromPanel","readAllFromPanelInProgress","writeToPanelCanceled","readAllFromPanelCanceled","nameOrderCanceled","powerUpCanceled"],"type":"string"}
