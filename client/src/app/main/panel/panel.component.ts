import { Component } from '@angular/core';
import { PanelService } from './panel.service';
import { Socket } from 'ngx-socket-io';
import { ActionType } from '../../api/models/action-type';
import { PanelService as API } from '../../api/services/panel.service';
import { PanelDetails } from '../../api/models/panel-details';
import { saveAs } from 'file-saver';
import { round } from 'lodash';

@Component({
  selector: 'app-panel',
  template: `
    <div fxLayout="column" fxFlexFill>
      <mat-toolbar fxLayoutAlign="space-between">
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
              <button mat-menu-item [matMenuTriggerFor]="upload">
                <mat-icon>file_upload</mat-icon>
                <span>Upload</span>
              </button>
              <button mat-menu-item [matMenuTriggerFor]="download">
                <mat-icon>file_download</mat-icon>
                <span>Download</span>
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
            <mat-menu #upload="matMenu">
              <button appFileUpload (fileContent)="uploadDump($event)" mat-menu-item><mat-icon>upload_file</mat-icon>Dump</button>
              <button appFileUpload (fileContent)="uploadCsv($event)" mat-menu-item><mat-icon>attach_file</mat-icon>Excel</button>
            </mat-menu>
            <mat-menu #download="matMenu">
              <button (click)="downloadDump()" mat-menu-item><mat-icon>download_file</mat-icon>Dump</button>
              <button (click)="downloadCsv()" mat-menu-item><mat-icon>download_file</mat-icon>Excel</button>
            </mat-menu>
          </div>
          <app-progress *ngIf="this.showProgressBar" [doneCount]="doneCount" [initialCount]="initialCount"></app-progress>
          <button mat-button *ngIf="doneCount === initialCount && this.showProgressBar" (click)="this.service.showProgressBar = false">
            <mat-icon>download_done</mat-icon>
          </button>
          <button mat-button *ngIf="doneCount !== initialCount && this.showProgressBar" (click)="cancelAction()">
            <mat-icon>cancel</mat-icon> Cancel
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
  constructor(public service: PanelService, private socket: Socket, private api: API) {
    setInterval(() => {
      this.lastConnect = round((+new Date() - (this.currentPanel?.lastConnection || 0)) / 1000);
    }, 1000);
  }

  get isConnected() {
    return this.lastConnect < 7;
  }

  get showProgressBar(): boolean {
    return this.service.showProgressBar!;
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
    this.service.showProgressBar = true;
    this.currentPanel.status = status;
    this.api.savePanel(this.currentPanel).subscribe(() => {});
  }

  cancelAction() {
    this.currentPanel.status = ActionType.idle;
    this.api.savePanel(this.currentPanel).subscribe(() => {
      this.service.showProgressBar = false;
    });
  }

  uploadDump(dump: any) {
    this.service.reDump(dump);
  }

  async downloadDump() {
    this.api.dump(this.currentPanel).subscribe(dump => {
      const blob = new Blob([dump], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, 'dump.txt');
    });
  }

  uploadCsv(file: any) {
    this.service.uploadCsv(file);
  }

  downloadCsv() {
    this.service.downloadCsv();
  }
}
