import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { SwagularService } from 'swagular';
import { FormModel } from 'swagular/models';

@Injectable({
  providedIn: 'root'
})
export class LogService extends BaseService {
  /**
   * Path part for operation logs
   */
  static readonly LogsPath = '/log/logs';
  /**
   * Path part for operation createLogToken
   */
  static readonly CreateLogTokenPath = '/log/create-log-token';

  constructor(config: ApiConfiguration, http: HttpClient, private swagularService: SwagularService) {
    super(config, http);
  }

  logs(): Observable<Array<any>> {
    const rb = new RequestBuilder(this.rootUrl, LogService.LogsPath, 'get');

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/json'
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map(r => r.body as Array<any>)
      );
  }

  createLogToken(): Observable<string> {
    const rb = new RequestBuilder(this.rootUrl, LogService.CreateLogTokenPath, 'get');

    return this.http
      .request(
        rb.build({
          responseType: 'text',
          accept: 'text/plain'
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map(r => r.body as string)
      );
  }
}
