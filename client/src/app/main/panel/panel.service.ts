import { Injectable } from '@angular/core';
import { PanelDetails } from '../../api/models/panel-details';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Contacts } from '../../api/models/contacts';

@Injectable({
  providedIn: 'root'
})
export class PanelService {
  currentPanel?: PanelDetails;
  contacts?: Contacts;
  constructor(private router: Router, private socket: Socket) {
    socket.on('panelUpdate', (panel: PanelDetails) => {
      this.currentPanel = panel;
    });
    socket.on('updateContacts', (contacts: Contacts) => (this.contacts = contacts));
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
