import { Component } from '@angular/core';
import { TableOptions } from 'swagular/components';
import { orderBy } from 'lodash';
import { PanelService } from '../../../api/services/panel.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-panel-logs',
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
export class PanelLogsComponent {
  logs: any;
  logsTableOptions: TableOptions<any> = {
    columns: [
      { key: 'time', title: 'Time' },
      { key: 'type', title: 'Action Type' },
      { key: 'data', title: 'Data' },
      { key: 'req', title: 'Request' },
      { key: 'res', title: 'Response' }
    ]
  };
  constructor(private panelService: PanelService, private route: ActivatedRoute) {
    this.panelService.logs_1(route.snapshot.params.panelId).subscribe(logs => {
      this.logs = orderBy(logs, 'time', 'desc');
    });
  }
}
