import { Component } from '@angular/core';
import { PanelService } from './panel.service';
import { Socket } from 'ngx-socket-io';
import { ActionType } from '../../api/models/action-type';
import { PanelService as API } from '../../api/services/panel.service';
import { PanelDetails } from '../../api/models/panel-details';
import { saveAs } from 'file-saver';
import { round } from 'lodash';
import { IPanelToolBar, IRootObject } from '../../../../../shared/locale.interface';
import { LocaleService } from 'swagular/components';

@Component({
  selector: 'app-panel',
  template: `
    <div fxLayout="column" fxFlexFill *ngIf="locale">
      <mat-toolbar *ngIf="currentPanel">
        <div fxFlex="40%">
          <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Example icon-button with a menu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu>
            <button mat-menu-item [matMenuTriggerFor]="sent">
              <mat-icon>pin_invoke</mat-icon>
              <span>{{ locale.sent }}</span>
            </button>
            <button mat-menu-item [matMenuTriggerFor]="receive">
              <mat-icon>pin_end</mat-icon>
              <span>{{ locale.receive }}</span>
            </button>
            <button mat-menu-item [matMenuTriggerFor]="upload">
              <mat-icon>file_upload</mat-icon>
              <span>{{ locale.upload }}</span>
            </button>
            <button mat-menu-item [matMenuTriggerFor]="download">
              <mat-icon>file_download</mat-icon>
              <span>{{ locale.download }}</span>
            </button>
          </mat-menu>
          <mat-menu #sent="matMenu">
            <button (click)="changeStatus(status.writeToPanel)" mat-menu-item>
              <mat-icon>call_made</mat-icon> {{ locale.sentChangesTo }}
            </button>
            <button (click)="changeStatus(status.nameOrder)" mat-menu-item><mat-icon>sort</mat-icon> {{ locale.nameOrder }}</button>
            <button (click)="changeStatus(status.powerUp)" mat-menu-item>
              <mat-icon>power_settings_new</mat-icon> {{ locale.powerUp }}
            </button>
          </mat-menu>
          <mat-menu #receive="matMenu">
            <button (click)="changeStatus(status.readAllFromPanel)" mat-menu-item>{{ locale.getAll }}</button>
          </mat-menu>
          <mat-menu #upload="matMenu">
            <button appFileUpload (fileContent)="uploadDump($event)" mat-menu-item>
              <mat-icon>upload_file</mat-icon> {{ locale.dump }}
            </button>
            <button appFileUpload (fileContent)="uploadCsv($event)" mat-menu-item>
              <mat-icon>attach_file</mat-icon> {{ locale.excel }}
            </button>
          </mat-menu>
          <mat-menu #download="matMenu">
            <button (click)="downloadDump()" mat-menu-item><mat-icon>download_file</mat-icon>{{ locale.dump }}</button>
            <button (click)="downloadCsv()" mat-menu-item><mat-icon>download_file</mat-icon>{{ locale.excel }}</button>
          </mat-menu>
          <a *ngIf="currentPanel" mat-button [routerLink]="'contacts/' + currentPanel.panelId">{{ locale.editContact }}</a>
          <a *ngIf="currentPanel" mat-button [routerLink]="'settings/' + currentPanel.panelId">{{ locale.editSettings }}</a>
        </div>
        <div *ngIf="currentPanel" fxLayout="row">
          <span> panel id{{ ' ' + currentPanel.panelId + ' ' }} {{ ' ' + (currentPanel.address || '') + ' ' }} </span>
          <div fxLayoutAlign="center center" fxLayout="row">
            <span fxFlex="30px" *ngIf="lastConnect < 30"> {{ lastConnect }}</span>
            <div class="circle" [class.connect]="isConnected" [class.disconnect]="!isConnected"></div>
          </div>
          <app-progress *ngIf="this.showProgressBar" [doneCount]="doneCount" [initialCount]="initialCount"></app-progress>
          <button mat-button *ngIf="doneCount === initialCount && this.showProgressBar" (click)="this.service.showProgressBar = false">
            <mat-icon>download_done</mat-icon>
          </button>
          <button mat-button *ngIf="doneCount !== initialCount && this.showProgressBar" (click)="cancelAction()">
            <mat-icon>cancel</mat-icon> {{ locale.cancel }}
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
  locale?: IPanelToolBar;
  constructor(public service: PanelService, private socket: Socket, private api: API, public localeService: LocaleService) {
    this.localeService.locale.subscribe((locale: IRootObject | undefined) => (this.locale = locale?.panelToolBar));

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
