import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { SwagularService } from 'swagular';
import { FormModel } from 'swagular/models';

import { User, UserSchema } from '../models/user';

  
    export declare type SaveOrUpdateUserFormGroupType = User
    export const saveOrUpdateUserFormGroupSchema = UserSchema;

    export declare type DeleteUserFormGroupType = User
    export const deleteUserFormGroupSchema = UserSchema;

    export declare type UnDeleteUserFormGroupType = User
    export const unDeleteUserFormGroupSchema = UserSchema;


@Injectable({
  providedIn: 'root',
})
export class AdminService extends BaseService {
    /**
     * Path part for operation users
     */
    static readonly UsersPath = '/admin/users';
    /**
     * Path part for operation saveOrUpdateUser
     */
    static readonly SaveOrUpdateUserPath = '/admin/save-or-update-user';
    /**
     * Path part for operation deleteUser
     */
    static readonly DeleteUserPath = '/admin/delete-user';
    /**
     * Path part for operation unDeleteUser
     */
    static readonly UnDeleteUserPath = '/admin/un-delete-user';
  constructor(config: ApiConfiguration, http: HttpClient, private swagularService: SwagularService) {
    super(config, http);
  }
  users(
): Observable<Array<User>> {
const rb = new RequestBuilder(this.rootUrl, AdminService.UsersPath, 'get');



return this.http.request(rb.build({
responseType: 'json',
accept: 'application/json'
})).pipe(
filter((r: any) => r instanceof HttpResponse),
map(r => r.body as Array<User>)
);

  }

  saveOrUpdateUser(        
       user 
: User

): Observable<User> {
const rb = new RequestBuilder(this.rootUrl, AdminService.SaveOrUpdateUserPath, 'post');


  rb.body(   user 
, 'application/json');

return this.http.request(rb.build({
responseType: 'json',
accept: 'application/json'
})).pipe(
filter((r: any) => r instanceof HttpResponse),
map(r => r.body as User)
);

  }

  deleteUser(        
       user 
: User

): Observable<User> {
const rb = new RequestBuilder(this.rootUrl, AdminService.DeleteUserPath, 'post');


  rb.body(   user 
, 'application/json');

return this.http.request(rb.build({
responseType: 'json',
accept: 'application/json'
})).pipe(
filter((r: any) => r instanceof HttpResponse),
map(r => r.body as User)
);

  }

  unDeleteUser(        
       user 
: User

): Observable<User> {
const rb = new RequestBuilder(this.rootUrl, AdminService.UnDeleteUserPath, 'post');


  rb.body(   user 
, 'application/json');

return this.http.request(rb.build({
responseType: 'json',
accept: 'application/json'
})).pipe(
filter((r: any) => r instanceof HttpResponse),
map(r => r.body as User)
);

  }

  
     saveOrUpdateUserFormGroup(value?:SaveOrUpdateUserFormGroupType) {
    return this.swagularService.getFormGroup<SaveOrUpdateUserFormGroupType>(saveOrUpdateUserFormGroupSchema, value);
  }

   saveOrUpdateUserFormModel(options?: Partial<FormModel> & { displayProperties?: (keyof SaveOrUpdateUserFormGroupType & string)[] }, value?: SaveOrUpdateUserFormGroupType) {
    return this.swagularService.getFormModel<SaveOrUpdateUserFormGroupType>(saveOrUpdateUserFormGroupSchema, options as any, value);
  }

     deleteUserFormGroup(value?:DeleteUserFormGroupType) {
    return this.swagularService.getFormGroup<DeleteUserFormGroupType>(deleteUserFormGroupSchema, value);
  }

   deleteUserFormModel(options?: Partial<FormModel> & { displayProperties?: (keyof DeleteUserFormGroupType & string)[] }, value?: DeleteUserFormGroupType) {
    return this.swagularService.getFormModel<DeleteUserFormGroupType>(deleteUserFormGroupSchema, options as any, value);
  }

     unDeleteUserFormGroup(value?:UnDeleteUserFormGroupType) {
    return this.swagularService.getFormGroup<UnDeleteUserFormGroupType>(unDeleteUserFormGroupSchema, value);
  }

   unDeleteUserFormModel(options?: Partial<FormModel> & { displayProperties?: (keyof UnDeleteUserFormGroupType & string)[] }, value?: UnDeleteUserFormGroupType) {
    return this.swagularService.getFormModel<UnDeleteUserFormGroupType>(unDeleteUserFormGroupSchema, options as any, value);
  }

}
