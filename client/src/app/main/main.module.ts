import { Component, NgModule } from '@angular/core';
import { ComponentModule } from '../components/component.module';
import { RouterModule } from '@angular/router';
import { ToolbarComponent } from './toolbar.component';
import { MatMenuModule } from '@angular/material/menu';
@Component({
  selector: 'app-root',
  template: `
    <div fxLayout="column" fxFlexFill>
      <app-toolbar></app-toolbar>
      <div fxFlex style="padding: 1%;">
        <router-outlet
          style="flex: 1 1 auto;
          display: flex;
          overflow: hidden;"
        ></router-outlet>
      </div>
    </div>
  `
})
class MainComponent {}

@NgModule({
  declarations: [MainComponent, ToolbarComponent],
  imports: [
    ComponentModule,
    RouterModule.forChild([
      {
        path: '',
        component: MainComponent,
        children: [
          {
            path: 'admin',
            loadChildren: () => import('src/app/main/admin/admin.module').then(m => m.AdminModule)
          }
        ]
      }
    ]),
    MatMenuModule
  ]
})
export class MainModule {}
