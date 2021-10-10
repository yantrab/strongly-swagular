export interface IRootObject {
    loginForm: ILoginForm;
    setPasswordForm: ISetPasswordForm;
    saveOrUpdateUserForm: ISaveOrUpdateUserForm;
    addPanelFormModel: IAddPanelFormModel;
    savePanelFormModel: ISavePanelFormModel;
    panelsTableOptions: IPanelsTableOptions;
    contactsTableOptions: IContactsTableOptions;
    updateContactFormModel: IUpdateContactFormModel;
    mainToolVar: IMainToolVar;
    panelToolBar: IPanelToolBar;
}
export interface ILoginForm {
    formTitle: string;
    formSaveButtonTitle: string;
    email: IEmail;
    password: IPassword;
}
export interface IEmail {
    label: string;
}
export interface IPassword {
    label: string;
}
export interface ISetPasswordForm {
    formTitle: string;
    formSaveButtonTitle: string;
    email: IEmail;
    password: IPassword;
    rePassword: IRePassword;
}
export interface IRePassword {
    label: string;
}
export interface ISaveOrUpdateUserForm {
    formTitle: string;
}
export interface IAddPanelFormModel {
    formTitle: string;
    panelId: IPanelId;
    id: IId;
    address: IAddress;
    direction: IDirection;
    phoneNumber: IPhoneNumber;
    contactName: IContactName;
    contactPhone: IContactPhone;
}
export interface IPanelId {
    label: string;
    hint: string;
}
export interface IId {
    label: string;
}
export interface IAddress {
    label: string;
}
export interface IDirection {
    label: string;
}
export interface IPhoneNumber {
    label: string;
}
export interface IContactName {
    label: string;
    hint: string;
}
export interface IContactPhone {
    label: string;
}
export interface ISavePanelFormModel {
    formTitle: string;
    address: IAddress;
    phoneNumber: IPhoneNumber;
    contactName: IContactName;
    contactPhone: IContactPhone;
}
export interface IPanelsTableOptions {
    columns: IColumnsItem[];
}
export interface IColumnsItem {
    key: string;
    title: string;
}
export interface IContactsTableOptions {
    columns: IColumnsItem[];
}
export interface IUpdateContactFormModel {
    formTitle: string;
    name1: IName1;
    name2: IName2;
    tel1: ITel1;
    tel2: ITel2;
    tel3: ITel3;
    tel4: ITel4;
    tel5: ITel5;
    tel6: ITel6;
    code: ICode;
    ref: IRef;
    apartment: IApartment;
}
export interface IName1 {
    label: string;
}
export interface IName2 {
    label: string;
}
export interface ITel1 {
    label: string;
}
export interface ITel2 {
    label: string;
}
export interface ITel3 {
    label: string;
}
export interface ITel4 {
    label: string;
}
export interface ITel5 {
    label: string;
}
export interface ITel6 {
    label: string;
}
export interface ICode {
    label: string;
}
export interface IRef {
    label: string;
}
export interface IApartment {
    label: string;
}
export interface IMainToolVar {
    language: string;
    logout: string;
    hebrew: string;
    english: string;
}
export interface IPanelToolBar {
    list: string;
    editContact: string;
    editSettings: string;
    sent: string;
    receive: string;
    upload: string;
    download: string;
    sentChangesTo: string;
    nameOrder: string;
    powerUp: string;
    getAll: string;
    dump: string;
    excel: string;
    cancel: string;
    444: string;
    12: string;
    notConnected: string;
}
