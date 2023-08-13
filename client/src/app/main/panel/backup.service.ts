import { Injectable } from '@angular/core';
import { Contacts } from '../../api/models/contacts';
import { cloneDeep } from 'lodash';
import { Settings } from 'src/app/api/models/settings';

@Injectable({
  providedIn: 'root'
})
export class BackupService {
  currentPanelId!: number;
  private backup: { [id: string]: { data: { contacts?: Contacts; settings?: Settings }[]; index: number; savedIndex: number } } = {};

  get panelBackupIndex() {
    return this.panelBackup.index;
  }

  get panelBackupData() {
    return this.panelBackup.data[this.panelBackupIndex];
  }

  get panelBackup() {
    return this.backup[this.currentPanelId];
  }

  resetSavedIndex() {
    this.panelBackup.savedIndex = this.panelBackup.index;
  }

  addBackup(contacts?: Contacts, settings?: Settings) {
    const backup = (this.backup[this.currentPanelId] = this.backup[this.currentPanelId] || { data: [], index: 0 });
    backup.data.push({ settings: cloneDeep(settings), contacts: cloneDeep(contacts) });
    backup.index = backup.data.length - 1;
  }

  initBackup(contacts?: Contacts, settings?: Settings) {
    const backup = (this.backup[this.currentPanelId] = this.backup[this.currentPanelId] || {
      data: [],
      index: 0,
      savedIndex: 0
    });
    if (backup.data.length) {
      backup.data[backup.savedIndex].settings = settings || backup.data[backup.savedIndex].settings;
      backup.data[backup.savedIndex].contacts = contacts || backup.data[backup.savedIndex].contacts;
    } else {
      this.addBackup(contacts, settings);
    }
  }

  goToBackup(direction: number) {
    const backup = this.backup[this.currentPanelId];
    backup.index += direction;
    return backup.data[backup.index];
  }
}
