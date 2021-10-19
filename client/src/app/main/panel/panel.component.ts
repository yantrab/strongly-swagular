import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { PanelService } from './panel.service';
import { Socket } from 'ngx-socket-io';
import { ActionType } from '../../api/models/action-type';
import { PanelService as API } from '../../api/services/panel.service';
import { PanelDetails } from '../../api/models/panel-details';
import { saveAs } from 'file-saver';
import { round } from 'lodash';
import { IPanelToolBar, IRootObject } from '../../api/locale.interface';
import { LocaleService } from 'swagular/components';
import { Source } from '../../api/models/source';

@Component({
  selector: 'app-panel',
  template: `
    <div fxLayout="column" fxFlexFill *ngIf="locale">
      <mat-toolbar *ngIf="currentPanel" fxLayoutAlign="space-between center">
        <div fxFlex="30%">
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
            <button (click)="changeStatus(status.writeAllToPanel)" mat-menu-item>
              <mat-icon>call_made</mat-icon> {{ locale.sentAllToPanel }}
            </button>
            <button (click)="changeStatus(status.nameOrder)" mat-menu-item><mat-icon>sort</mat-icon> {{ locale.nameOrder }}</button>
            <button (click)="changeStatus(status.powerUp)" mat-menu-item>
              <mat-icon>power_settings_new</mat-icon> {{ locale.powerUp }}
            </button>
          </mat-menu>
          <mat-menu #receive="matMenu">
            <button (click)="changeStatus(status.readAllFromPanel)" mat-menu-item>{{ locale.getAll }}</button>
            <button (click)="reset()" mat-menu-item>{{ locale.reset }}</button>
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
          <a mat-button [routerLink]="'contacts/' + currentPanel.panelId">{{ locale.editContact }}</a>
          <a mat-button [routerLink]="'settings/' + currentPanel.panelId">{{ locale.editSettings }}</a>
          <a mat-button [routerLink]="'logs/' + currentPanel.panelId">{{ locale.logs }}</a>
        </div>
        <div fxLayout="row" fxFlex="25%">
          <span> {{ ' ' + (currentPanel.address || '') + ' ' }} </span>
          <!--          <div fxLayoutAlign="center center" fxLayout="row">-->
          <!--            <span fxFlex="30px" *ngIf="lastConnect < 30"> {{ lastConnect }}</span>-->
          <!--          </div>-->
        </div>

        <app-progress
          *ngIf="showProgressBar && initialCount"
          [status]="statusText"
          [doneCount]="doneCount"
          [initialCount]="initialCount"
          (cancel)="cancelAction()"
          (done)="service.showProgressBar = false"
        ></app-progress>
        <div fxLayout="row" class="connected-indicator">
          <!--          <span *ngIf="!isConnected"> {{ locale.notConnected }}</span>-->
          <div class="circle" [class.connect]="isConnected" [class.disconnect]="!isConnected"></div>
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
  styleUrls: ['panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanelComponent {
  lastConnect = 0;
  status = ActionType;
  locale?: IPanelToolBar;
  constructor(
    public service: PanelService,
    private socket: Socket,
    private api: API,
    public localeService: LocaleService,
    private cd: ChangeDetectorRef
  ) {
    this.localeService.locale.subscribe((locale: IRootObject | undefined) => {
      if (!locale) {
        return;
      }
      this.locale = locale.panelToolBar;
      this.cd.markForCheck();
    });
    this.service.contacts.subscribe(() => this.cd.markForCheck());
    setInterval(() => {
      this.lastConnect = round((+new Date() - (this.currentPanel?.lastConnection || 0)) / 1000);
      this.cd.markForCheck();
    }, 1000);
  }

  get isConnected() {
    return this.lastConnect && this.lastConnect < 15;
  }

  get showProgressBar(): boolean {
    return this.service.showProgressBar!;
  }

  get statusText(): string | undefined {
    return this.locale?.[this.currentPanel.status.toString() as keyof IPanelToolBar];
  }

  get currentPanel(): PanelDetails {
    return this.service.currentPanel!;
  }

  get doneCount() {
    switch (this.currentPanel.status.toString()) {
      case ActionType.nameOrder:
      case ActionType.powerUp:
      case ActionType.readAllFromPanel:
      case ActionType.readAllFromPanelInProgress:
      case ActionType.writeAllToPanel:
      case ActionType.writeAllToPanelInProgress:
        return this.currentPanel.msgCount || 0;
      case ActionType.writeToPanel:
      case ActionType.writeToPanelInProgress:
        return (
          (this.service.contacts.value?.changes.filter(c => c.previewsValue === null).length || 0) +
          (this.service.settings.value?.changes.filter(c => c.previewsValue === null).length || 0)
        );
    }
    return 0;
  }

  get initialCount() {
    switch (this.currentPanel.status.toString()) {
      case ActionType.nameOrder:
      case ActionType.powerUp:
        return 1;
      case ActionType.readAllFromPanel:
      case ActionType.readAllFromPanelInProgress:
        return 32;
      case ActionType.writeAllToPanel:
      case ActionType.writeAllToPanelInProgress:
        return 40;
      case ActionType.writeToPanel:
      case ActionType.writeToPanelInProgress:
        return (this.service.contacts.value?.changes.length || 0) + (this.service.settings.value?.changes.length || 0);
    }
    return 1;
  }

  changeStatus(status: ActionType) {
    this.service.showProgressBar = true;
    this.currentPanel.status = status;
    this.api.savePanel(this.currentPanel).subscribe(() => {
      this.cd.markForCheck();
    });
  }

  cancelAction() {
    switch (this.currentPanel.status) {
      case ActionType.readAllFromPanelInProgress:
        this.currentPanel.status = ActionType.readAllFromPanelCanceled;
        break;
      case ActionType.writeToPanelInProgress:
      case ActionType.writeAllToPanelInProgress:
        this.currentPanel.status = ActionType.writeToPanelCanceled;
        break;
      default:
        this.currentPanel.status = ActionType.idle;
        const contacts = this.service.contacts.value!;
        contacts.changes = contacts.changes.filter(c => c.source === Source.client);
        this.service.updateContacts(contacts.changes, contacts.list, this.currentPanel.panelId);
    }
    this.api.savePanel(this.currentPanel).subscribe(() => {
      this.service.showProgressBar = false;
      this.cd.markForCheck();
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
  reset() {
    this.service.reset();
  }
}
