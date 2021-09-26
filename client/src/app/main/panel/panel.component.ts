import { Component } from '@angular/core';
import { PanelService } from './panel.service';
import { Socket } from 'ngx-socket-io';
import { ActionType } from '../../api/models/action-type';
import { PanelService as API } from '../../api/services/panel.service';
import { PanelDetails } from '../../api/models/panel-details';

@Component({
  selector: 'app-admin',
  template: `
    <div fxLayout="column" fxFlexFill>
      <mat-toolbar>
        <div fxFlex="40%">
          <a mat-button routerLink="list">Panel List</a>
          <a *ngIf="currentPanel" mat-button [routerLink]="'contacts/' + currentPanel.panelId">Edit Panel Contact</a>
          <a *ngIf="currentPanel" mat-button [routerLink]="'settings/' + currentPanel.panelId">Edit Panel Settings</a>
        </div>
        <div *ngIf="currentPanel" fxLayout="row">
          <span> Edit panel id{{ ' ' + currentPanel.panelId + ' ' }} address:{{ ' ' + currentPanel.address + ' ' }} </span>
          <div fxLayoutAlign="center center" fxLayout="row">
            <span fxFlex="30px" *ngIf="lastConnect < 30"> {{ lastConnect }}</span>
            <div class="circle" [class.connect]="isConnected" [class.disconnect]="!isConnected"></div>
            <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Example icon-button with a menu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu>
              <button mat-menu-item [matMenuTriggerFor]="sent">
                <mat-icon>pin_invoke</mat-icon>
                <span>sent</span>
              </button>
              <button mat-menu-item [matMenuTriggerFor]="receive">
                <mat-icon>pin_end</mat-icon>
                <span>receive</span>
              </button>
            </mat-menu>
            <mat-menu #sent="matMenu">
              <button (click)="changeStatus(status.writeToPanel)" mat-menu-item>
                <mat-icon>call_made</mat-icon> Sent changes to the panel
              </button>
              <button (click)="changeStatus(status.nameOrder)" mat-menu-item><mat-icon>sort</mat-icon> Sent changes to the panel</button>
              <button (click)="changeStatus(status.powerUp)" mat-menu-item>
                <mat-icon>power_settings_new</mat-icon> Sent changes to the panel
              </button>
            </mat-menu>
            <mat-menu #receive="matMenu">
              <button (click)="changeStatus(status.readAllFromPanel)" mat-menu-item>Get all from panel</button>
            </mat-menu>
          </div>
          <app-progress *ngIf="currentPanel.status != status.idle" [doneCount]="doneCount" [initialCount]="initialCount"></app-progress>
          <button mat-button *ngIf="doneCount === initialCount && this.showProgressBar" (click)="this.showProgressBar = false">
            close
          </button>
        </div>
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
  styleUrls: ['panel.component.scss']
})
export class PanelComponent {
  lastConnect = 0;
  status = ActionType;
  showProgressBar = false;
  constructor(private service: PanelService, private socket: Socket, private api: API) {
    setInterval(() => this.lastConnect++, 1000);
    this.socket.on('panelUpdate', () => (this.lastConnect = 0));
  }

  get isConnected() {
    return this.lastConnect < 7;
  }

  get currentPanel(): PanelDetails {
    return this.service.currentPanel!;
  }

  get doneCount() {
    return this.service.contacts.value?.changes.filter(c => c.previewsValue === null).length;
  }

  get initialCount() {
    return this.service.contacts.value?.changes.length;
  }
  changeStatus(status: ActionType) {
    this.showProgressBar = true;
    this.currentPanel.status = status;
    this.api.savePanel(this.currentPanel).subscribe(() => {});
  }
}
