import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelListComponent } from './panel-list/panel-list.component';
import { RouterModule } from '@angular/router';
import { ComponentModule } from '../../components/component.module';
import { SettingsComponent } from './settings/settings.component';
import { ContactsComponent } from './contacts/contacts.component';
import { PanelComponent } from './panel.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PanelService } from './panel.service';

@NgModule({
  declarations: [PanelListComponent, PanelComponent, SettingsComponent, ContactsComponent],
  imports: [
    ComponentModule,
    CommonModule,
    RouterModule.forChild([
      { path: '', redirectTo: 'list', pathMatch: 'full' },
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
    MatSlideToggleModule,
    MatMenuModule,
    MatSnackBarModule
  ],
  providers: [PanelService]
})
export class PanelModule {}
