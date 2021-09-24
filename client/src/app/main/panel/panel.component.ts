import { Component } from '@angular/core';
import { PanelService } from './panel.service';
import { Socket } from 'ngx-socket-io';

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
        <div *ngIf="currentPanel">
          <span> Edit panel id{{ ' ' + currentPanel.panelId + ' ' }} address:{{ ' ' + currentPanel.address + ' ' }} </span>
          <div fxLayoutAlign="center center">
            <span fxFlex="30px" *ngIf="lastConnect < 30"> {{ lastConnect }}</span>
            <div class="circle" [class.connect]="isConnected" [class.disconnect]="!isConnected"></div>
          </div>
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

  constructor(private service: PanelService, private socket: Socket) {
    setInterval(() => this.lastConnect++, 1000);
    this.socket.on('panelUpdate', () => (this.lastConnect = 0));
  }

  get isConnected() {
    return this.lastConnect < 7;
  }

  get currentPanel() {
    return this.service.currentPanel;
  }
}
