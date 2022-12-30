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
import { Buffer } from 'buffer';
import { SerialPort } from './serial';

@Component({
  selector: 'app-panel',
  template: `
    <div fxLayout="column" fxFlexFill *ngIf="locale">
      <mat-toolbar *ngIf="currentPanel" fxLayoutAlign="space-between center" fxLayout="row wrap">
        <div fxFlex="50%" fxFlex.lt-md="100%">
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
              <span>{{ locale.upload.title }}</span>
            </button>
            <button mat-menu-item [matMenuTriggerFor]="download">
              <mat-icon>file_download</mat-icon>
              <span>{{ locale.download.title }}</span>
            </button>
          </mat-menu>
          <mat-menu #sent="matMenu">
            <button (click)="changeStatus(status.writeToPanel)" mat-menu-item>
              <mat-icon>call_made</mat-icon>
              {{ locale.sentChangesTo }}
            </button>
            <button (click)="changeStatus(status.writeAllToPanel)" mat-menu-item>
              <mat-icon>call_made</mat-icon>
              {{ locale.sentAllToPanel }}
            </button>
            <button (click)="changeStatus(status.nameOrder)" mat-menu-item>
              <mat-icon>sort</mat-icon>
              {{ locale.nameOrder }}
            </button>
            <button (click)="changeStatus(status.powerUp)" mat-menu-item>
              <mat-icon>power_settings_new</mat-icon>
              {{ locale.powerUp }}
            </button>
          </mat-menu>
          <mat-menu #receive="matMenu">
            <button (click)="changeStatus(status.readAllFromPanel)" mat-menu-item>{{ locale.getAll }}</button>
            <button (click)="reset()" mat-menu-item>{{ locale.reset }}</button>
          </mat-menu>
          <mat-menu #upload="matMenu">
            <button appFileUpload (fileContent)="uploadDump($event)" mat-menu-item>
              <mat-icon>upload_file</mat-icon>
              {{ locale.upload.dump }}
            </button>
            <button appFileUpload (fileContent)="uploadCsv($event)" mat-menu-item>
              <mat-icon>attach_file</mat-icon>
              {{ locale.upload.excel }}
            </button>
            <button (click)="uploadEpprom()" mat-menu-item>
              <mat-icon>usb</mat-icon>
              {{ locale.upload.epprom }}
            </button>
          </mat-menu>
          <mat-menu #download="matMenu">
            <button (click)="downloadDump()" mat-menu-item>
              <mat-icon>download_file</mat-icon>
              {{ locale.download.dump }}
            </button>
            <button (click)="downloadCsv()" mat-menu-item>
              <mat-icon>download_file</mat-icon>
              {{ locale.download.excel }}
            </button>
            <button (click)="downloadEpprom()" mat-menu-item>
              <mat-icon>usb</mat-icon>
              {{ locale.download.epprom }}
            </button>
          </mat-menu>
          <a mat-button [routerLink]="'contacts/' + currentPanel.panelId">{{ locale.editContact }}</a>
          <a mat-button [routerLink]="'settings/' + currentPanel.panelId">{{ locale.editSettings }}</a>
          <a mat-button [routerLink]="'logs/' + currentPanel.panelId">{{ locale.logs }}</a>
        </div>
        <div fxFlex fxLayout="row" fxFlex.lt-md="100%" fxLayoutAlign="space-between center">
          <span> {{ ' ' + (currentPanel.address || '') + ' ' }} </span>
          <div fxLayout="row" fxLayoutAlign="end">
            <app-progress
              [fxShow.lt-md]="false"
              *ngIf="showProgressBar"
              [status]="statusText"
              (cancel)="cancelAction()"
              [pst]="currentPanel?.progressPst || 0"
              (done)="service.showProgressBar = false"
            ></app-progress>
            <div class="connected-indicator">
              <!--          <span *ngIf="!isConnected"> {{ locale.notConnected }}</span>-->
              <div class="circle" [class.connect]="isConnected" [class.disconnect]="!isConnected"></div>
            </div>
          </div>
        </div>
      </mat-toolbar>
      <app-progress
        [fxHide.gt-md]="true"
        *ngIf="showProgressBar"
        [status]="statusText"
        (cancel)="cancelAction()"
        [pst]="currentPanel?.progressPst || 1"
        (done)="service.showProgressBar = false"
      ></app-progress>

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
  port?: { port?: SerialPort; reader?: ReadableStreamDefaultReader<any>; writer?: WritableStreamDefaultWriter<any> };

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
    return this.locale?.[this.currentPanel.status.toString() as keyof IPanelToolBar] as string;
  }

  get currentPanel(): PanelDetails {
    return this.service.currentPanel!;
  }

  changeStatus(status: ActionType) {
    this.service.showProgressBar = true;
    this.currentPanel.status = status;
    this.currentPanel.progressPst = 1;
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

  doneAction() {
    this.currentPanel.status = ActionType.idle;
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

  async uploadEpprom() {
    try {
      let checkReadThisAdd = '0';
      let { reader, writer } = await this.openSerialPort();
      this.currentPanel.status = ActionType.uploadEpprom;
      this.service.showProgressBar = true;
      // @ts-ignore
      const encoder = new TextEncoder('utf-8');
      let result = '';
      const read = async () => {
        return new Promise(async (resolve, reject) => {
          let readerData;
          const buffData: number[] = [];
          try {
            readerData = await reader.read();
          } catch (x) {
            console.log(x);
          }
          readerData = readerData?.value;
          let error = 0;
          if (readerData.length === 42) {
            const checkSumRead =
              String.fromCharCode(readerData[38]) + String.fromCharCode(readerData[39]) + String.fromCharCode(readerData[40]);
            let testCheckSum = 5;
            for (let i = 2; i <= 37; i++) {
              const n = String.fromCharCode(readerData[i]);
              const hexValue = n.toString();
              let hexBiggerThan9 = 0;
              if (hexValue > '9') {
                if (hexValue === ':') hexBiggerThan9 = 10;
                else if (hexValue === ';') hexBiggerThan9 = 11;
                else if (hexValue === '<') hexBiggerThan9 = 12;
                else if (hexValue === '=') hexBiggerThan9 = 13;
                else if (hexValue === '>') hexBiggerThan9 = 14;
                else if (hexValue === '?') hexBiggerThan9 = 15;

                testCheckSum = testCheckSum + hexBiggerThan9;
                hexBiggerThan9 = testCheckSum;
              }
              testCheckSum += parseInt(hexValue, 16);
              if (hexBiggerThan9) testCheckSum = hexBiggerThan9;
              if (testCheckSum > 999) testCheckSum -= 1000;
            }
            const decCheckSumRead = parseInt(checkSumRead, 10);
            if (testCheckSum !== decCheckSumRead) error = 1;
          }

          const readThisAdd1 = checkReadThisAdd[0];
          const readThisAdd2 = checkReadThisAdd[1];
          const readThisAdd3 = checkReadThisAdd[2];
          const readThisAdd4 = checkReadThisAdd[3];

          const cardReadAdd1 = String.fromCharCode(readerData[2]);
          const cardReadAdd2 = String.fromCharCode(readerData[3]);
          const cardReadAdd3 = String.fromCharCode(readerData[4]);
          const cardReadAdd4 = String.fromCharCode(readerData[5]);

          if (readThisAdd1 !== cardReadAdd1) error = 1;
          if (readThisAdd2 !== cardReadAdd2) error = 1;
          if (readThisAdd3 !== cardReadAdd3) error = 1;
          if (readThisAdd4 !== cardReadAdd4) error = 1;

          if (readerData.length !== 42 || readerData[0] !== 4 || readerData[1] !== 114 || error) {
            return reject();
          }

          for (let i = 6; i < 38; i++) {
            let hexValue = readerData[i];
            let hexString = hexValue.toString(16);
            const a = hexString[1];
            i++;
            hexValue = readerData[i];
            hexString = hexValue.toString(16);

            const b = hexString[1];
            const n = parseInt(a + b, 16);
            if (n < 187 && n > 159) {
              buffData.push(215);
              buffData.push(n - 16);
            } else {
              buffData.push(n);
            }
          }
          const b = Buffer.from(buffData);
          result += new TextDecoder().decode(b);
          resolve(result);
        });
      };
      const length = 4095;
      for (let i = 0; i <= length; i++) {
        this.currentPanel.progressPst = (1 / (length / 100)) * i;
        const address = ('0000' + i.toString()).slice(-4).toUpperCase();
        let check = 20;
        address.split('').forEach(l => {
          const hexValue = (+l).toString();
          check += parseInt(hexValue, 16);
          if (check > 999) check -= 1000;
        });
        const checkSum = ('000' + check.toString().toUpperCase()).slice(-3);

        const comString = String.fromCharCode(4) + 'R' + address + checkSum + String.fromCharCode(13);
        const comm = encoder.encode(comString);
        checkReadThisAdd = address;
        await writer.write(comm);
        try {
          await read();
          console.log(i);
        } catch (x) {
          if (i - 4000 > 0) {
            await reader?.cancel();
            await reader.releaseLock();
            this.port!.reader = reader = this.port!.port!.readable.getReader();
          }
          i--;
        }
      }
      this.uploadDump(result);
      this.closeSerialPort().then(() => {
        this.currentPanel.status = ActionType.idle;
        this.currentPanel.progressPst = 100;
      });
    } catch (x) {
      console.log(x);
    }
  }

  async downloadEpprom() {
    let { reader, writer } = await this.openSerialPort();
    this.service.showProgressBar = true;
    this.currentPanel.status = ActionType.downloadEpprom;
    // @ts-ignore
    const encoder = new TextEncoder('utf-8');
    const read = async (address: string, checkSum: Uint8Array) => {
      return new Promise(async (resolve, reject) => {
        const readerData = await reader.read();
        const data = readerData.value;
        if (
          data[0] !== 4 ||
          data[1] !== 119 ||
          new TextDecoder().decode(data.slice(2, 6)) !== address ||
          new TextDecoder().decode(data.slice(6, 9)) !== new TextDecoder().decode(checkSum)
        ) {
          reject();
        }
        resolve(undefined);
      });
    };
    this.api.dump(this.currentPanel).subscribe(async dump => {
      let i = 0;
      const bachSize = 16;
      while (i < dump.length / bachSize) {
        this.currentPanel.progressPst = (1 / (dump.length / bachSize / 100)) * i;

        const dumpArray: number[] = [];
        const dumpSplit = (dump.slice(i * bachSize, i * bachSize + bachSize) + ' '.repeat(bachSize)).slice(0, bachSize);
        encoder
          .encode(dumpSplit)
          //.filter((n, i) => i % 2 === 1)
          .forEach(n => {
            if (n === 215) return;
            if (n <= 170 && n >= 144) {
              n += 16;
            }
            const h = n.toString(16);
            const a = '3' + h[0];
            const b = '3' + h[1];
            dumpArray.push(parseInt(a, 16));
            dumpArray.push(parseInt(b, 16));
          });
        console.log('i=' + i);
        const dataToSent = dumpArray;
        const address = ('0000' + i.toString()).slice(-4);
        const comm = [...encoder.encode(address), ...dataToSent];
        let check = 12;
        comm.forEach(n => {
          check += n & parseInt('f', 16);
          if ((n & parseInt('f0', 16)) === parseInt('40', 16)) {
            check += 9;
          }
          if (check > 999) check -= 1000;
        });
        const checkSum = encoder.encode(('000' + check).slice(-3));
        await writer.write(new Buffer([4, 87, ...comm, ...checkSum, 13]));
        try {
          await read(address, checkSum);
          i += 1;
        } catch (e) {
          if (i > 3000) {
            console.log('reread due to failed operation');
            await reader?.cancel();
            await reader.releaseLock();
            this.port!.reader = reader = this.port!.port!.readable.getReader();
          }
        }
      }

      this.closeSerialPort().then(() => {
        this.currentPanel.status = ActionType.idle;
        this.currentPanel.progressPst = 100;
      });
    });
  }

  private async openSerialPort() {
    const port = await navigator.serial.requestPort({});
    await port.open({ baudRate: 57600, stopBits: 1 });
    const reader = port.readable.getReader();
    const writer = port.writable.getWriter();
    this.port = { port, reader, writer };
    return { reader, writer };
  }

  private async closeSerialPort() {
    console.log('closing serial port');
    await this.port?.reader?.releaseLock();
    await this.port?.writer?.releaseLock();
    return this.port?.port?.close();
  }
}
