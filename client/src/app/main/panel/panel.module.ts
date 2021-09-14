import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelListComponent } from './panel-list/panel-list.component';
import { RouterModule } from '@angular/router';
import { ComponentModule } from '../../components/component.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SettingsComponent } from './settings/settings.component';
import { ContactsComponent } from './contacts/contacts.component';

@Component({
  selector: 'app-admin',
  template: `
    <div fxLayout="column" fxFlexFill>
      <mat-toolbar>
        <a mat-button routerLink="list">list</a>
      </mat-toolbar>
      <div style="padding: 1%;" fxFlex>
        <router-outlet
          style="flex: 1 1 auto;
          display: flex;
          overflow: hidden;"
        ></router-outlet>
      </div>
    </div>
  `,
  styles: [
    `
      mat-toolbar a {
        margin: 0 5px;
      }
    `
  ]
})
class PanelComponent {}

@NgModule({
  declarations: [PanelListComponent, PanelComponent, SettingsComponent, ContactsComponent],
  imports: [
    ComponentModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: PanelComponent,
        children: [
          { path: 'list', component: PanelListComponent },
          { path: 'contacts/:panelId', component: ContactsComponent },
          { path: 'settings/:panelId', component: SettingsComponent }
        ]
      }
    ]),
    MatSlideToggleModule
  ]
})
export class PanelModule {}
