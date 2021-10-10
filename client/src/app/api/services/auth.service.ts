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

    export declare type LoginFormGroupType = { 'password': string, 'email': string }
    export const loginFormGroupSchema = {"properties":{"password":{"type":"string","minLength":6},"email":{"format":"email","type":"string"}},"type":"object","required":["password","email"]}

    export declare type SetPasswordFormGroupType = { 'rePassword': string, 'password': string, 'email': string }
    export const setPasswordFormGroupSchema = {"properties":{"rePassword":{"type":"string","minLength":6,"const":{"$data":"1/password"}},"password":{"type":"string","minLength":6},"email":{"format":"email","type":"string"}},"type":"object","required":["rePassword","password","email"]}

  
  
  


/**
 * User authentication stuff
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
    /**
     * Path part for operation login
     */
    static readonly LoginPath = '/auth/login';
    /**
     * Path part for operation setPassword
     */
    static readonly SetPasswordPath = '/auth/set-password';
    /**
     * Path part for operation logout
     */
    static readonly LogoutPath = '/auth/logout';
    /**
     * Path part for operation getUserAuthenticated
     */
    static readonly GetUserAuthenticatedPath = '/auth/get-user-authenticated';
    /**
     * Path part for operation resetPassword
     */
    static readonly ResetPasswordPath = '/auth/reset/{email}';
  constructor(config: ApiConfiguration, http: HttpClient, private swagularService: SwagularService) {
    super(config, http);
  }
  login(        
       body 
: { 'password': string, 'email': string }

): Observable<User> {
const rb = new RequestBuilder(this.rootUrl, AuthService.LoginPath, 'post');


  rb.body(   body 
, 'application/json');

return this.http.request(rb.build({
responseType: 'json',
accept: 'application/json'
})).pipe(
filter((r: any) => r instanceof HttpResponse),
map(r => r.body as User)
);

  }

  setPassword(      token: string,

         body 
: { 'rePassword': string, 'password': string, 'email': string }


): Observable<boolean> {
const rb = new RequestBuilder(this.rootUrl, AuthService.SetPasswordPath, 'post');

  rb.header('token', token, {});

  rb.body(   body 
, 'application/json');

return this.http.request(rb.build({
responseType: 'text',
accept: 'text/plain'
})).pipe(
filter((r: any) => r instanceof HttpResponse),
map(r => r.body as boolean)
);

  }

  logout(
): Observable<void> {
const rb = new RequestBuilder(this.rootUrl, AuthService.LogoutPath, 'post');



return this.http.request(rb.build({
responseType: 'text',
accept: '*/*'
})).pipe(
filter((r: any) => r instanceof HttpResponse),
map(r => r.body as void)
);

  }

  getUserAuthenticated(
): Observable<User> {
const rb = new RequestBuilder(this.rootUrl, AuthService.GetUserAuthenticatedPath, 'get');



return this.http.request(rb.build({
responseType: 'json',
accept: 'application/json'
})).pipe(
filter((r: any) => r instanceof HttpResponse),
map(r => r.body as User)
);

  }

  resetPassword(      email: string,



): Observable<void> {
const rb = new RequestBuilder(this.rootUrl, AuthService.ResetPasswordPath, 'put');

  rb.path('email', email, {});


return this.http.request(rb.build({
responseType: 'text',
accept: '*/*'
})).pipe(
filter((r: any) => r instanceof HttpResponse),
map(r => r.body as void)
);

  }

     loginFormGroup(value?:LoginFormGroupType) {
    return this.swagularService.getFormGroup<LoginFormGroupType>(loginFormGroupSchema, value);
  }

   loginFormModel(options?: Partial<FormModel> & { displayProperties?: (keyof LoginFormGroupType & string)[] }, value?: LoginFormGroupType) {
    return this.swagularService.getFormModel<LoginFormGroupType>(loginFormGroupSchema, options as any, value);
  }

     setPasswordFormGroup(value?:SetPasswordFormGroupType) {
    return this.swagularService.getFormGroup<SetPasswordFormGroupType>(setPasswordFormGroupSchema, value);
  }

   setPasswordFormModel(options?: Partial<FormModel> & { displayProperties?: (keyof SetPasswordFormGroupType & string)[] }, value?: SetPasswordFormGroupType) {
    return this.swagularService.getFormModel<SetPasswordFormGroupType>(setPasswordFormGroupSchema, options as any, value);
  }

  
  
  
}
