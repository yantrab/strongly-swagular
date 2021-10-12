import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { SwagularService } from 'swagular';
import { FormModel } from 'swagular/models';

import { AddPanelDetailsDto, AddPanelDetailsDtoSchema } from '../models/add-panel-details-dto';import { ChangeItem, ChangeItemSchema } from '../models/change-item';import { Contact, ContactSchema } from '../models/contact';import { Contacts, ContactsSchema } from '../models/contacts';import { PanelDetails, PanelDetailsSchema } from '../models/panel-details';

  
  
    export declare type AddNewPanelFormGroupType = AddPanelDetailsDto
    export const addNewPanelFormGroupSchema = AddPanelDetailsDtoSchema;

    export declare type SavePanelFormGroupType = PanelDetails
    export const savePanelFormGroupSchema = PanelDetailsSchema;

  
    export declare type UpdateContactFormGroupType = { 'changes': Array<ChangeItem>, 'contact': Contact }
    export const updateContactFormGroupSchema = {"properties":{"changes":{"type":"array","items":{"$ref":"#/components/schemas/ChangeItem"}},"contact":{"$ref":"#/components/schemas/Contact"}},"type":"object","required":["changes","contact"]}

  
    export declare type ReDumpFormGroupType = { 'dump': string, 'panel': PanelDetails }
    export const reDumpFormGroupSchema = {"properties":{"dump":{"type":"string"},"panel":{"$ref":"#/components/schemas/PanelDetails"}},"type":"object","required":["dump","panel"]}

    export declare type UpdateContactsFormGroupType = { 'changes': Array<ChangeItem>, 'contacts': Array<Contact>, 'panelId': number }
    export const updateContactsFormGroupSchema = {"properties":{"changes":{"type":"array","items":{"$ref":"#/components/schemas/ChangeItem"}},"contacts":{"type":"array","items":{"$ref":"#/components/schemas/Contact"}},"panelId":{"type":"number"}},"type":"object","required":["changes","contacts","panelId"]}


@Injectable({
  providedIn: 'root',
})
export class PanelService extends BaseService {
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
  constructor(config: ApiConfiguration, http: HttpClient, private swagularService: SwagularService) {
    super(config, http);
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

  updateContact(      id: number,

         body 
: { 'changes': Array<ChangeItem>, 'contact': Contact }


): Observable<void> {
const rb = new RequestBuilder(this.rootUrl, PanelService.UpdateContactPath, 'post');

  rb.path('id', id, {});

  rb.body(   body 
, 'application/json');

return this.http.request(rb.build({
responseType: 'text',
accept: '*/*'
})).pipe(
filter((r: any) => r instanceof HttpResponse),
map(r => r.body as void)
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
: { 'dump': string, 'panel': PanelDetails }

): Observable<{ 'contacts': Contacts }> {
const rb = new RequestBuilder(this.rootUrl, PanelService.ReDumpPath, 'post');


  rb.body(   body 
, 'application/json');

return this.http.request(rb.build({
responseType: 'json',
accept: 'application/json'
})).pipe(
filter((r: any) => r instanceof HttpResponse),
map(r => r.body as { 'contacts': Contacts })
);

  }

  updateContacts(        
       body 
: { 'changes': Array<ChangeItem>, 'contacts': Array<Contact>, 'panelId': number }

): Observable<void> {
const rb = new RequestBuilder(this.rootUrl, PanelService.UpdateContactsPath, 'post');


  rb.body(   body 
, 'application/json');

return this.http.request(rb.build({
responseType: 'text',
accept: '*/*'
})).pipe(
filter((r: any) => r instanceof HttpResponse),
map(r => r.body as void)
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

}
