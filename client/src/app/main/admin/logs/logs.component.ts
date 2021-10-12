import { Component } from '@angular/core';
import { LogService } from '../../../api/services/log.service';
import { TableOptions } from 'swagular/components';
import { orderBy } from 'lodash';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-panels-logs',
  template: `
    <div fxFlexFill *ngIf="logs" fxLayout="column">
      <swagular-table style="padding: 50px" fxFlex [dataSource]="logs" [options]="logsTableOptions">
        <ng-template appCellDef column="time" let-row="row">
          {{ row.time | date: 'dd/MM/YY HH:mm:ss' }}
        </ng-template>
      </swagular-table>
    </div>
  `
})
export class LogsComponent {
  logs: any;
  logsTableOptions: TableOptions<any> = {
    columns: [
      { key: 'time', title: 'Time' },
      { key: 'hostname', title: 'Hostname' },
      { key: 'level', title: 'Level' },
      { key: 'msg', title: 'Massage' },
      { key: 'pid', title: 'ID' },
      { key: 'url', title: 'url' },
      { key: 'method', title: 'method' },
      { key: 'statusCode', title: 'Status Code' }
    ]
  };
  constructor(private logService: LogService, private socket: Socket) {
    logService.logs().subscribe(logs => {
      this.logs = orderBy(
        logs.map(l => ({ ...l, ...l.req, ...l.res })),
        'time',
        'desc'
      );
      this.logService.createLogToken().subscribe(token => {
        this.socket.emit('registerToLogs', token);
        this.socket.on('log', (log: any) => {
          const l = JSON.parse(log);
          this.logs = [{ ...l, ...l.req, ...l.res }, ...this.logs];
        });
      });
    });
  }
}
