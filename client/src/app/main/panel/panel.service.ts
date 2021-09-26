import { Injectable } from '@angular/core';
import { PanelDetails } from '../../api/models/panel-details';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Contacts } from '../../api/models/contacts';
import { PanelService as API } from '../../api/services/panel.service';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PanelService {
  currentPanel?: PanelDetails;
  contacts: BehaviorSubject<Contacts | undefined> = new BehaviorSubject<Contacts | undefined>(undefined);
  constructor(private router: Router, private socket: Socket, private api: API) {
    socket.on('panelUpdate', (panel: PanelDetails) => {
      this.currentPanel = panel;
    });
    socket.on('updateContacts', (contacts: Contacts) => this.contacts.next(contacts));
  }

  getContacts(panelId: number) {
    this.api.contacts(panelId).subscribe((contacts: Contacts) => this.contacts.next(contacts));
    return this.contacts;
  }
  navigateToContact(panel: PanelDetails) {
    this.navigateTo('panel/contacts/', panel);
  }

  navigateToSettings(panel: PanelDetails) {
    this.navigateTo('panel/settings/', panel);
  }

  private navigateTo(path: string, panel: PanelDetails) {
    if (this.currentPanel && this.currentPanel.panelId !== panel.panelId) {
      this.socket.emit('unRegisterToPanel', this.currentPanel.panelId);
    } else if (this.currentPanel?.panelId !== panel.panelId) {
      this.socket.emit('registerToPanel', panel.panelId);
    }
    this.currentPanel = panel;

    this.router.navigate([path + panel.panelId]).then();
  }
}
