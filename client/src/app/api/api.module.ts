import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiConfiguration, ApiConfigurationParams } from './api-configuration';
import { AdminService } from './services/admin.service';
import { AuthService } from './services/auth.service';
import { LogService } from './services/log.service';
import { PanelService } from './services/panel.service';
import * as models from './models';
import { SwagularService } from 'swagular';
/**
 * Module that provides all services and configuration.
 */
@NgModule({
  imports: [HttpClientModule],
  exports: [],
  declarations: [],
  providers: [AdminService, AuthService, LogService, PanelService, ApiConfiguration]
})
export class ApiModule {
  static forRoot(params: ApiConfigurationParams): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: [
        {
          provide: ApiConfiguration,
          useValue: params
        }
      ]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: ApiModule, @Optional() http: HttpClient, swagularService: SwagularService) {
    if (parentModule) {
      throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
    }
    if (!http) {
      throw new Error(
        'You need to import the HttpClientModule in your AppModule! \n' + 'See also https://github.com/angular/angular/issues/20575'
      );
    }
    Object.keys(models).forEach(key => {
      if (key.endsWith('Schema')) {
        swagularService.addSchema('#/components/schemas/' + key.replace('Schema', ''), (models as any)[key]);
      }
    });
  }
}
