import { Injectable } from '@angular/core';
import { PanelDetails } from '../../api/models/panel-details';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PanelService {
  currentPanel?: PanelDetails;
  constructor(private router: Router) {}

  navigateToContact(panel: PanelDetails) {
    this.currentPanel = panel;
    this.router.navigate(['panel/contacts/' + panel.panelId]);
  }

  navigateToSettings(panel: PanelDetails) {
    this.currentPanel = panel;
    this.router.navigate(['panel/settings/' + panel.panelId]);
  }
}
