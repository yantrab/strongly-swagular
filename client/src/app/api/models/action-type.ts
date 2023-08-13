export enum ActionType {
  idle = '000',
  status = '6',
  nameOrder = '777',
  powerUp = '888',
  writeAllToPanel = '222',
  writeAllToPanelInProgress = '10',
  writeToPanel = '444',
  writeToPanelInProgress = '12',
  readAllFromPanel = '333',
  readAllFromPanelInProgress = '13',
  writeToPanelCanceled = 'RRR',
  readAllFromPanelCanceled = 'SSS',
  nameOrderCanceled = 'TTT',
  powerUpCanceled = '808',
  uploadEpprom = '1',
  downloadEpprom = '2'
}

export const ActionTypeSchema  = {"enum":["000","6","777","888","222","10","444","12","333","13","RRR","SSS","TTT","808","1","2"],"x-enumNames":["idle","status","nameOrder","powerUp","writeAllToPanel","writeAllToPanelInProgress","writeToPanel","writeToPanelInProgress","readAllFromPanel","readAllFromPanelInProgress","writeToPanelCanceled","readAllFromPanelCanceled","nameOrderCanceled","powerUpCanceled","uploadEpprom","downloadEpprom"],"type":"string"}
