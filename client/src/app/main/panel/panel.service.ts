import { Injectable } from '@angular/core';
import { PanelDetails } from '../../api/models/panel-details';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Contacts } from '../../api/models/contacts';
import { PanelService as API } from '../../api/services/panel.service';
import { BehaviorSubject } from 'rxjs';
import { ActionType } from '../../api/models/action-type';
import { ExcelService } from '../../services/excel.service';
import { getContactsChanges } from '../../../../../shared/panel';
import { Source } from '../../api/models/source';
import { Contact } from '../../api/models/contact';
import { LocaleService } from 'swagular/components';
import { cloneDeep } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class PanelService {
  currentPanel?: PanelDetails;
  contacts: BehaviorSubject<Contacts | undefined> = new BehaviorSubject<Contacts | undefined>(undefined);
  showProgressBar = false;
  constructor(
    private router: Router,
    private socket: Socket,
    private api: API,
    private excelService: ExcelService,
    private localeService: LocaleService
  ) {
    socket.on('panelUpdate', (panel: PanelDetails) => {
      this.currentPanel = panel;
    });
    socket.on('updateContacts', (contacts: Contacts) => this.contacts.next(contacts));
  }

  getContacts(panelId: number) {
    this.api.contacts(panelId).subscribe((contacts: Contacts) => {
      this.contacts.next(contacts);
    });
    return this.contacts;
  }
  navigateToContact(panel: PanelDetails) {
    this.navigateTo('panel/contacts/', panel);
  }

  navigateToSettings(panel: PanelDetails) {
    this.navigateTo('panel/settings/', panel);
  }

  reDump(dump: string) {
    this.api.reDump({ dump: '_' + dump, panel: this.currentPanel! }).subscribe(result => {
      this.contacts.next(result.contacts);
    });
  }

  uploadCsv(file: any) {
    this.localeService.getLocaleItem('contactsTableOptions.columns').then(columns => {
      const contacts = cloneDeep(this.contacts.value!);
      contacts.changes = contacts.changes || [];
      contacts.list = this.excelService.readFile<Contact>(file, columns);
      contacts.changes = contacts.changes.concat(getContactsChanges(contacts.list, this.contacts.value!.list, Source.client));
      this.api
        .updateContacts({
          contacts: contacts.list,
          changes: contacts.changes,
          panelId: this.currentPanel!.panelId
        })
        .subscribe(() => {
          this.contacts.next(contacts);
        });
    });
  }

  downloadCsv() {
    this.localeService.getLocaleItem('contactsTableOptions.columns').then(columns => {
      this.excelService.writeFile(this.contacts.value!.list, 'contacts.xlsx', { columns });
    });
  }

  private navigateTo(path: string, panel: PanelDetails) {
    if (this.currentPanel && this.currentPanel.panelId !== panel.panelId) {
      this.socket.emit('unRegisterToPanel', this.currentPanel.panelId);
    } else if (this.currentPanel?.panelId !== panel.panelId) {
      this.socket.emit('registerToPanel', panel.panelId);
    }
    this.currentPanel = panel;
    this.showProgressBar = this.currentPanel.status !== ActionType.idle;

    this.router.navigate([path + panel.panelId]).then();
  }
}
