import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { RouterModule } from '@angular/router';
import { ComponentModule } from '../../components/component.module';
import { LogsComponent } from './logs/logs.component';

@Component({
  selector: 'app-admin',
  template: `
    <div fxLayout="column" fxFlexFill>
      <mat-toolbar>
        <a mat-button routerLink="users">Users</a>
        <a mat-button routerLink="logs">logs</a>
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
class AdminComponent {}

@NgModule({
  declarations: [UserComponent, AdminComponent, LogsComponent],
  imports: [
    ComponentModule,
    CommonModule,
    RouterModule.forChild([
      { path: '', redirectTo: 'users', pathMatch: 'full' },

      {
        path: '',
        component: AdminComponent,
        children: [
          { path: 'users', component: UserComponent },
          { path: 'logs', component: LogsComponent }
        ]
      }
    ])
  ]
})
export class AdminModule {}
