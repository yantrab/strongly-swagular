import { Component, NgModule } from '@angular/core';
import { ComponentModule } from '../components/component.module';
import { RouterModule } from '@angular/router';
import { ToolbarComponent } from './toolbar.component';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { LocaleService } from 'swagular/components';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
@Component({
  selector: 'app-root',
  template: `
    <div fxLayout="column" fxFlexFill [dir]="localeService.direction" *ngIf="show">
      <app-toolbar></app-toolbar>
      <div fxFlex>
        <router-outlet
          style="flex: 1 1 auto;
          display: flex;
          overflow: hidden;"
        ></router-outlet>
      </div>
    </div>
  `
})
class MainComponent {
  show = true;
  constructor(public localeService: LocaleService) {
    localeService.locale.subscribe(() => {
      this.show = false;
      setTimeout(() => {
        this.show = true;
      });
    });
  }
}

@NgModule({
  declarations: [MainComponent, ToolbarComponent],
  imports: [
    ComponentModule,
    RouterModule.forChild([
      { path: '', redirectTo: 'panel', pathMatch: 'full' },

      {
        path: '',
        component: MainComponent,
        children: [
          { path: 'admin', loadChildren: () => import('src/app/main/admin/admin.module').then(m => m.AdminModule) },
          { path: 'panel', loadChildren: () => import('src/app/main/panel/panel.module').then(m => m.PanelModule) }
        ]
      }
    ]),
    MatMenuModule,
    MatSlideToggleModule
  ]
})
export class MainModule {}
