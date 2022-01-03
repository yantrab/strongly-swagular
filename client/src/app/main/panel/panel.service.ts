import { Injectable } from '@angular/core';
import { PanelDetails } from '../../api/models/panel-details';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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
import { filter, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddPanelDetailsDto } from '../../api/models/add-panel-details-dto';
import { ChangeItem } from '../../api/models/change-item';
import { Settings } from 'src/app/api/models/settings';

@Injectable({
  providedIn: 'root'
})
export class PanelService {
  currentPanel?: PanelDetails;
  contacts = new BehaviorSubject<Contacts | undefined>(undefined);
  settings = new BehaviorSubject<Settings | undefined>(undefined);
  panelList = new BehaviorSubject<PanelDetails[] | undefined>(undefined);
  showProgressBar = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private socket: Socket,
    private api: API,
    private excelService: ExcelService,
    private localeService: LocaleService,
    private snackBar: MatSnackBar
  ) {
    socket.on('panelUpdate', (panel: PanelDetails) => {
      this.currentPanel = panel;
    });
    socket.on('updateContacts', (contacts: Contacts) => this.contacts.next(contacts));
    socket.on('updateSettings', (settings: Settings) => this.settings.next(settings));
    //this.router.onSameUrlNavigation = 'reload';
    api.list().subscribe(panels => {
      this.panelList.next(panels);
      // for refresh
      this.router.routerState.root.params.subscribe(() => {
        const panelId = +this.getLeafRoute(this.router.routerState.root)?.snapshot.params.panelId;
        if (panelId) this.setSelectedPanel(panels.find(p => p.panelId === panelId)!);
      });
      this.router.events
        .pipe(
          filter(event => event instanceof NavigationEnd),
          map(() => this.getLeafRoute(this.router.routerState.root)?.snapshot.params)
        )
        .subscribe(params => {
          if (params?.panelId && +params?.panelId !== this.currentPanel?.panelId)
            this.setSelectedPanel(panels.find(p => p.panelId === +params?.panelId)!);
        });
    });
  }

  getContacts(panelId: number) {
    this.api.contacts(panelId).subscribe((contacts: Contacts) => {
      this.contacts.next(contacts);
    });
    return this.contacts;
  }

  getSettings(panelId: number) {
    this.api.settings(panelId).subscribe((settings: Settings) => {
      this.settings.next(settings);
    });
    return this.settings;
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
      this.settings.next(result.settings);
    });
  }

  uploadCsv(file: any) {
    return new Promise(() => {
      this.localeService.getLocaleItem('contactsTableOptions.columns').then(columns => {
        const contacts = cloneDeep(this.contacts.value!);
        contacts.changes = contacts.changes || [];
        contacts.list = this.excelService.readFile<Contact>(file, columns);
        contacts.list.forEach(c => {
          c.name1 = c.name1?.trim();
          c.name2 = c.name2?.trim();
          c.tel1 = c.tel1?.toString();
          c.tel2 = c.tel2?.toString();
          c.tel3 = c.tel3?.toString();
          c.tel1 = c.tel1?.match(/\d+/g)?.join('');
          c.tel2 = c.tel2?.match(/\d+/g)?.join('');
          c.tel3 = c.tel3?.match(/\d+/g)?.join('');

          if (c.tel1 && !c.tel1.startsWith('0')) c.tel1 = '0' + c.tel1;
          if (c.tel2 && !c.tel2.startsWith('0')) c.tel2 = '0' + c.tel2;
          if (c.tel3 && !c.tel3.startsWith('0')) c.tel3 = '0' + c.tel3;
        });
        contacts.changes = contacts.changes.concat(getContactsChanges(contacts.list, this.contacts.value!.list, Source.client));
        this.updateContacts(contacts.changes, contacts.list, this.currentPanel!.panelId).subscribe(() => this.contacts.next(contacts));
      });
    });
  }

  updateContacts(changes: Array<ChangeItem>, list: Array<Contact>, panelId: number) {
    return this.api.updateContacts({
      contacts: list,
      changes,
      panelId
    });
  }

  downloadCsv() {
    this.localeService.getLocaleItem('contactsTableOptions.columns').then(columns => {
      this.excelService.writeFile(this.contacts.value!.list, 'contacts.xlsx', { columns });
    });
  }

  setSelectedPanel(panel: PanelDetails) {
    this.currentPanel = panel;
    this.showProgressBar = this.currentPanel.status !== ActionType.idle;
    this.socket.emit('registerToPanel', panel.panelId);
  }

  addPanel(panel: AddPanelDetailsDto) {
    this.api.addNewPanel(panel).subscribe(
      savedPanel => {
        this.panelList.next(this.panelList.value?.concat([savedPanel]));
        this.snackBar.open('Panel was saved successfully', '', { duration: 2000 });
        this.navigateToContact(savedPanel);
      },
      error => {
        console.log(JSON.stringify(error));
        this.snackBar.open(error.error?.message, '', { duration: 5000 });
      }
    );
  }

  reset() {
    this.api.reset(this.currentPanel?.panelId!).subscribe(value => {
      this.contacts.next(value.contacts);
      this.settings.next(value.settings);
    });
  }

  private getLeafRoute(route: ActivatedRoute): ActivatedRoute | undefined {
    if (route === null) return undefined; //or throw ?
    while (route.firstChild) route = route.firstChild;
    return route;
  }

  private navigateTo(path: string, panel: PanelDetails) {
    this.setSelectedPanel(panel);
    this.router.navigate([path + panel.panelId]).then();
  }
}
