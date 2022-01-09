import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { SwagularService } from 'swagular';
import { FormModel } from 'swagular/models';

import { AddPanelDetailsDto, AddPanelDetailsDtoSchema } from '../models/add-panel-details-dto';import { ChangeItem, ChangeItemSchema } from '../models/change-item';import { Contact, ContactSchema } from '../models/contact';import { Contacts, ContactsSchema } from '../models/contacts';import { FloorValueSettings, FloorValueSettingsSchema } from '../models/floor-value-settings';import { GeneralSettings, GeneralSettingsSchema } from '../models/general-settings';import { PanelDetails, PanelDetailsSchema } from '../models/panel-details';import { Settings, SettingsSchema } from '../models/settings';import { SettingsChangeItem, SettingsChangeItemSchema } from '../models/settings-change-item';import { TimingSettings, TimingSettingsSchema } from '../models/timing-settings';import { YesNoQuestionsSettings, YesNoQuestionsSettingsSchema } from '../models/yes-no-questions-settings';

  
  
  
    export declare type AddNewPanelFormGroupType = AddPanelDetailsDto
    export const addNewPanelFormGroupSchema = AddPanelDetailsDtoSchema;

    export declare type SavePanelFormGroupType = PanelDetails
    export const savePanelFormGroupSchema = PanelDetailsSchema;

  
  
    export declare type UpdateContactFormGroupType = {
'changes': Array<ChangeItem>;
'contact': Contact;
}
    export const updateContactFormGroupSchema = {"properties":{"changes":{"type":"array","items":{"$ref":"#/components/schemas/ChangeItem"}},"contact":{"$ref":"#/components/schemas/Contact"}},"type":"object","required":["changes","contact"]}

  
    export declare type ReDumpFormGroupType = {
'dump': string;
'panel': PanelDetails;
}
    export const reDumpFormGroupSchema = {"properties":{"dump":{"type":"string"},"panel":{"$ref":"#/components/schemas/PanelDetails"}},"type":"object","required":["dump","panel"]}

    export declare type UpdateContactsFormGroupType = {
'changes': Array<ChangeItem>;
'contacts': Array<Contact>;
'panelId': number;
}
    export const updateContactsFormGroupSchema = {"properties":{"changes":{"type":"array","items":{"$ref":"#/components/schemas/ChangeItem"}},"contacts":{"type":"array","items":{"$ref":"#/components/schemas/Contact"}},"panelId":{"type":"number"}},"type":"object","required":["changes","contacts","panelId"]}

    export declare type GeneralSettingsFormGroupType = {
'changes': Array<SettingsChangeItem>;
'settings': GeneralSettings;
}
    export const generalSettingsFormGroupSchema = {"properties":{"changes":{"type":"array","items":{"$ref":"#/components/schemas/SettingsChangeItem"}},"settings":{"$ref":"#/components/schemas/GeneralSettings"}},"type":"object","required":["changes","settings"]}

    export declare type TimingSettingsFormGroupType = {
'changes': Array<SettingsChangeItem>;
'settings': TimingSettings;
}
    export const timingSettingsFormGroupSchema = {"properties":{"changes":{"type":"array","items":{"$ref":"#/components/schemas/SettingsChangeItem"}},"settings":{"$ref":"#/components/schemas/TimingSettings"}},"type":"object","required":["changes","settings"]}

    export declare type YesNoSettingsFormGroupType = {
'changes': Array<SettingsChangeItem>;
'settings': YesNoQuestionsSettings;
}
    export const yesNoSettingsFormGroupSchema = {"properties":{"changes":{"type":"array","items":{"$ref":"#/components/schemas/SettingsChangeItem"}},"settings":{"$ref":"#/components/schemas/YesNoQuestionsSettings"}},"type":"object","required":["changes","settings"]}

    export declare type FloorSettingsFormGroupType = {
'changes': Array<SettingsChangeItem>;
'settings': FloorValueSettings;
}
    export const floorSettingsFormGroupSchema = {"properties":{"changes":{"type":"array","items":{"$ref":"#/components/schemas/SettingsChangeItem"}},"settings":{"$ref":"#/components/schemas/FloorValueSettings"}},"type":"object","required":["changes","settings"]}


@Injectable({
  providedIn: 'root',
})
export class PanelService extends BaseService {
    /**
     * Path part for operation reset
     */
    static readonly ResetPath = '/panel/{id}/reset';
    /**
     * Path part for operation logs_1
     */
    static readonly Logs_1Path = '/panel/{id}/logs';
    /**
     * Path part for operation list
     */
    static readonly ListPath = '/panel/list';
    /**
     * Path part for operation addNewPanel
     */
    static readonly AddNewPanelPath = '/panel/add-new-panel';
    /**
     * Path part for operation savePanel
     */
    static readonly SavePanelPath = '/panel/save-panel';
    /**
     * Path part for operation contacts
     */
    static readonly ContactsPath = '/panel/{id}/contacts';
    /**
     * Path part for operation settings
     */
    static readonly SettingsPath = '/panel/{id}/settings';
    /**
     * Path part for operation updateContact
     */
    static readonly UpdateContactPath = '/panel/{id}/save-contacts';
    /**
     * Path part for operation dump
     */
    static readonly DumpPath = '/panel/dump';
    /**
     * Path part for operation reDump
     */
    static readonly ReDumpPath = '/panel/re-dump';
    /**
     * Path part for operation updateContacts
     */
    static readonly UpdateContactsPath = '/panel/update-contacts';
    /**
     * Path part for operation generalSettings
     */
    static readonly GeneralSettingsPath = '/panel/{id}/settings/general';
    /**
     * Path part for operation timingSettings
     */
    static readonly TimingSettingsPath = '/panel/{id}/settings/timing';
    /**
     * Path part for operation yesNoSettings
     */
    static readonly YesNoSettingsPath = '/panel/{id}/settings/questions';
    /**
     * Path part for operation floorSettings
     */
    static readonly FloorSettingsPath = '/panel/{id}/settings/floorValue';
  constructor(config: ApiConfiguration, http: HttpClient, private swagularService: SwagularService) {
    super(config, http);
  }
  reset(      id: number,



): Observable<{
'contacts': Contacts;
'settings': Settings;
}> {
const rb = new RequestBuilder(this.rootUrl, PanelService.ResetPath, 'put');

  rb.path('id', id, {});


return this.http.request(rb.build({
responseType: 'json',
accept: 'application/json'
})).pipe(
filter((r: any) => r instanceof HttpResponse),
map(r => r.body as {
'contacts': Contacts;
'settings': Settings;
})
);

  }

  logs_1(      id: number,



): Observable<Array<any>> {
const rb = new RequestBuilder(this.rootUrl, PanelService.Logs_1Path, 'get');

  rb.path('id', id, {});


return this.http.request(rb.build({
responseType: 'json',
accept: 'application/json'
})).pipe(
filter((r: any) => r instanceof HttpResponse),
map(r => r.body as Array<any>)
);

  }

  list(
): Observable<Array<PanelDetails>> {
const rb = new RequestBuilder(this.rootUrl, PanelService.ListPath, 'get');



return this.http.request(rb.build({
responseType: 'json',
accept: 'application/json'
})).pipe(
filter((r: any) => r instanceof HttpResponse),
map(r => r.body as Array<PanelDetails>)
);

  }

  addNewPanel(        
       addPanelDetailsDto 
: AddPanelDetailsDto

): Observable<PanelDetails> {
const rb = new RequestBuilder(this.rootUrl, PanelService.AddNewPanelPath, 'post');


  rb.body(   addPanelDetailsDto 
, 'application/json');

return this.http.request(rb.build({
responseType: 'json',
accept: 'application/json'
})).pipe(
filter((r: any) => r instanceof HttpResponse),
map(r => r.body as PanelDetails)
);

  }

  savePanel(        
       panelDetails 
: PanelDetails

): Observable<PanelDetails> {
const rb = new RequestBuilder(this.rootUrl, PanelService.SavePanelPath, 'post');


  rb.body(   panelDetails 
, 'application/json');

return this.http.request(rb.build({
responseType: 'json',
accept: 'application/json'
})).pipe(
filter((r: any) => r instanceof HttpResponse),
map(r => r.body as PanelDetails)
);

  }

  contacts(      id: number,



): Observable<Contacts> {
const rb = new RequestBuilder(this.rootUrl, PanelService.ContactsPath, 'get');

  rb.path('id', id, {});


return this.http.request(rb.build({
responseType: 'json',
accept: 'application/json'
})).pipe(
filter((r: any) => r instanceof HttpResponse),
map(r => r.body as Contacts)
);

  }

  settings(      id: number,



): Observable<Settings> {
const rb = new RequestBuilder(this.rootUrl, PanelService.SettingsPath, 'get');

  rb.path('id', id, {});


return this.http.request(rb.build({
responseType: 'json',
accept: 'application/json'
})).pipe(
filter((r: any) => r instanceof HttpResponse),
map(r => r.body as Settings)
);

  }

  updateContact(      id: number,

         body 
: {
'changes': Array<ChangeItem>;
'contact': Contact;
}


): Observable<any> {
const rb = new RequestBuilder(this.rootUrl, PanelService.UpdateContactPath, 'post');

  rb.path('id', id, {});

  rb.body(   body 
, 'application/json');

return this.http.request(rb.build({
responseType: 'json',
accept: 'application/json'
})).pipe(
filter((r: any) => r instanceof HttpResponse),
map(r => r.body as any)
);

  }

  dump(      query?: PanelDetails,



): Observable<string> {
const rb = new RequestBuilder(this.rootUrl, PanelService.DumpPath, 'get');

  rb.query('query', query, {});


return this.http.request(rb.build({
responseType: 'text',
accept: 'text/plain'
})).pipe(
filter((r: any) => r instanceof HttpResponse),
map(r => r.body as string)
);

  }

  reDump(        
       body 
: {
'dump': string;
'panel': PanelDetails;
}

): Observable<{
'contacts': Contacts;
'settings': Settings;
}> {
const rb = new RequestBuilder(this.rootUrl, PanelService.ReDumpPath, 'post');


  rb.body(   body 
, 'application/json');

return this.http.request(rb.build({
responseType: 'json',
accept: 'application/json'
})).pipe(
filter((r: any) => r instanceof HttpResponse),
map(r => r.body as {
'contacts': Contacts;
'settings': Settings;
})
);

  }

  updateContacts(        
       body 
: {
'changes': Array<ChangeItem>;
'contacts': Array<Contact>;
'panelId': number;
}

): Observable<any> {
const rb = new RequestBuilder(this.rootUrl, PanelService.UpdateContactsPath, 'post');


  rb.body(   body 
, 'application/json');

return this.http.request(rb.build({
responseType: 'json',
accept: 'application/json'
})).pipe(
filter((r: any) => r instanceof HttpResponse),
map(r => r.body as any)
);

  }

  generalSettings(      id: number,

         body 
: {
'changes': Array<SettingsChangeItem>;
'settings': GeneralSettings;
}


): Observable<any> {
const rb = new RequestBuilder(this.rootUrl, PanelService.GeneralSettingsPath, 'put');

  rb.path('id', id, {});

  rb.body(   body 
, 'application/json');

return this.http.request(rb.build({
responseType: 'json',
accept: 'application/json'
})).pipe(
filter((r: any) => r instanceof HttpResponse),
map(r => r.body as any)
);

  }

  timingSettings(      id: number,

         body 
: {
'changes': Array<SettingsChangeItem>;
'settings': TimingSettings;
}


): Observable<any> {
const rb = new RequestBuilder(this.rootUrl, PanelService.TimingSettingsPath, 'put');

  rb.path('id', id, {});

  rb.body(   body 
, 'application/json');

return this.http.request(rb.build({
responseType: 'json',
accept: 'application/json'
})).pipe(
filter((r: any) => r instanceof HttpResponse),
map(r => r.body as any)
);

  }

  yesNoSettings(      id: number,

         body 
: {
'changes': Array<SettingsChangeItem>;
'settings': YesNoQuestionsSettings;
}


): Observable<any> {
const rb = new RequestBuilder(this.rootUrl, PanelService.YesNoSettingsPath, 'put');

  rb.path('id', id, {});

  rb.body(   body 
, 'application/json');

return this.http.request(rb.build({
responseType: 'json',
accept: 'application/json'
})).pipe(
filter((r: any) => r instanceof HttpResponse),
map(r => r.body as any)
);

  }

  floorSettings(      id: number,

         body 
: {
'changes': Array<SettingsChangeItem>;
'settings': FloorValueSettings;
}


): Observable<any> {
const rb = new RequestBuilder(this.rootUrl, PanelService.FloorSettingsPath, 'put');

  rb.path('id', id, {});

  rb.body(   body 
, 'application/json');

return this.http.request(rb.build({
responseType: 'json',
accept: 'application/json'
})).pipe(
filter((r: any) => r instanceof HttpResponse),
map(r => r.body as any)
);

  }

  
  
  
     addNewPanelFormGroup(value?:AddNewPanelFormGroupType) {
    return this.swagularService.getFormGroup<AddNewPanelFormGroupType>(addNewPanelFormGroupSchema, value);
  }

   addNewPanelFormModel(options?: Partial<FormModel> & { displayProperties?: (keyof AddNewPanelFormGroupType & string)[] }, value?: AddNewPanelFormGroupType) {
    return this.swagularService.getFormModel<AddNewPanelFormGroupType>(addNewPanelFormGroupSchema, options as any, value);
  }

     savePanelFormGroup(value?:SavePanelFormGroupType) {
    return this.swagularService.getFormGroup<SavePanelFormGroupType>(savePanelFormGroupSchema, value);
  }

   savePanelFormModel(options?: Partial<FormModel> & { displayProperties?: (keyof SavePanelFormGroupType & string)[] }, value?: SavePanelFormGroupType) {
    return this.swagularService.getFormModel<SavePanelFormGroupType>(savePanelFormGroupSchema, options as any, value);
  }

  
  
     updateContactFormGroup(value?:UpdateContactFormGroupType) {
    return this.swagularService.getFormGroup<UpdateContactFormGroupType>(updateContactFormGroupSchema, value);
  }

   updateContactFormModel(options?: Partial<FormModel> & { displayProperties?: (keyof UpdateContactFormGroupType & string)[] }, value?: UpdateContactFormGroupType) {
    return this.swagularService.getFormModel<UpdateContactFormGroupType>(updateContactFormGroupSchema, options as any, value);
  }

  
     reDumpFormGroup(value?:ReDumpFormGroupType) {
    return this.swagularService.getFormGroup<ReDumpFormGroupType>(reDumpFormGroupSchema, value);
  }

   reDumpFormModel(options?: Partial<FormModel> & { displayProperties?: (keyof ReDumpFormGroupType & string)[] }, value?: ReDumpFormGroupType) {
    return this.swagularService.getFormModel<ReDumpFormGroupType>(reDumpFormGroupSchema, options as any, value);
  }

     updateContactsFormGroup(value?:UpdateContactsFormGroupType) {
    return this.swagularService.getFormGroup<UpdateContactsFormGroupType>(updateContactsFormGroupSchema, value);
  }

   updateContactsFormModel(options?: Partial<FormModel> & { displayProperties?: (keyof UpdateContactsFormGroupType & string)[] }, value?: UpdateContactsFormGroupType) {
    return this.swagularService.getFormModel<UpdateContactsFormGroupType>(updateContactsFormGroupSchema, options as any, value);
  }

     generalSettingsFormGroup(value?:GeneralSettingsFormGroupType) {
    return this.swagularService.getFormGroup<GeneralSettingsFormGroupType>(generalSettingsFormGroupSchema, value);
  }

   generalSettingsFormModel(options?: Partial<FormModel> & { displayProperties?: (keyof GeneralSettingsFormGroupType & string)[] }, value?: GeneralSettingsFormGroupType) {
    return this.swagularService.getFormModel<GeneralSettingsFormGroupType>(generalSettingsFormGroupSchema, options as any, value);
  }

     timingSettingsFormGroup(value?:TimingSettingsFormGroupType) {
    return this.swagularService.getFormGroup<TimingSettingsFormGroupType>(timingSettingsFormGroupSchema, value);
  }

   timingSettingsFormModel(options?: Partial<FormModel> & { displayProperties?: (keyof TimingSettingsFormGroupType & string)[] }, value?: TimingSettingsFormGroupType) {
    return this.swagularService.getFormModel<TimingSettingsFormGroupType>(timingSettingsFormGroupSchema, options as any, value);
  }

     yesNoSettingsFormGroup(value?:YesNoSettingsFormGroupType) {
    return this.swagularService.getFormGroup<YesNoSettingsFormGroupType>(yesNoSettingsFormGroupSchema, value);
  }

   yesNoSettingsFormModel(options?: Partial<FormModel> & { displayProperties?: (keyof YesNoSettingsFormGroupType & string)[] }, value?: YesNoSettingsFormGroupType) {
    return this.swagularService.getFormModel<YesNoSettingsFormGroupType>(yesNoSettingsFormGroupSchema, options as any, value);
  }

     floorSettingsFormGroup(value?:FloorSettingsFormGroupType) {
    return this.swagularService.getFormGroup<FloorSettingsFormGroupType>(floorSettingsFormGroupSchema, value);
  }

   floorSettingsFormModel(options?: Partial<FormModel> & { displayProperties?: (keyof FloorSettingsFormGroupType & string)[] }, value?: FloorSettingsFormGroupType) {
    return this.swagularService.getFormModel<FloorSettingsFormGroupType>(floorSettingsFormGroupSchema, options as any, value);
  }

}
