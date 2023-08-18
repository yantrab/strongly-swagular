import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormComponent, LocaleService, TableOptions } from 'swagular/components';

import { MatSnackBar } from '@angular/material/snack-bar';
import { PanelService as Api, SavePanelFormGroupType } from '../../../api/services/panel.service';
import { PanelDetails } from '../../../api/models/panel-details';
import { PanelService } from '../panel.service';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { ScannerComponent } from './scanner/scanner.component';
import { AuthService } from 'src/app/auth/auth.service';
import { Role } from 'src/app/api/models';
import { FormModel } from 'swagular/models';

@Component({
  selector: 'app-panel',
  templateUrl: './panel-list.component.html',
  styleUrls: ['./panel-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanelListComponent implements OnInit {
  panels: PanelDetails[] = [];
  addPanelFormModel = this.api.addNewPanelFormModel({
    localePath: 'addPanelFormModel',
    displayProperties: ['panelId', 'id', 'address', 'phoneNumber', 'code', 'direction', 'contactName', 'contactPhone']
  });
  updatePanelFormModel?: FormModel<SavePanelFormGroupType>;
  panelsTableOptions?: TableOptions<PanelDetails>;
  panelsToShow = this.panels;
  needToShowDeletedPanels = false;

  constructor(
    private api: Api,
    private panelService: PanelService,
    private dialog: NgDialogAnimationService,
    private snackBar: MatSnackBar,
    private localeService: LocaleService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {
    authService.user$.subscribe(user => {
      const displayProperties = ['code', 'address', 'phoneNumber', 'contactName', 'contactPhone', 'direction'];
      if (user.role === Role.admin) {
        displayProperties.push('inspiredDate');
      }
      this.updatePanelFormModel = this.api.savePanelFormModel({
        localePath: 'savePanelFormModel',
        displayProperties: displayProperties as any
      });
    });

    this.localeService.getLocaleItem('panelsTableOptions').then(options => {
      this.panelsTableOptions = {
        columns: options.columns,
        rowActions:
          window.innerWidth > 925
            ? [
                { icon: 'edit', action: ($event, row) => this.openEditPanelDialog(row), title: options.buttons.edit.title },
                {
                  icon: row => (row._isDeleted ? 'rotate_right' : 'delete'),
                  action: ($event, row) => this.deletePanel(row, this.needToShowDeletedPanels),
                  title: row => (row._isDeleted ? options.buttons.undoDelete.title : options.buttons.delete.title)
                },
                { icon: 'delete_forever', action: ($event, row) => this.purgePanel(row), title: 'מחק לצמיתות' },
                {
                  icon: 'manage_accounts',
                  action: ($event, row) => this.panelService.navigateToContact(row),
                  title: options.buttons.editContact.title
                },
                {
                  icon: 'settings',
                  action: ($event, row) => this.panelService.navigateToSettings(row),
                  title: options.buttons.editSettings.title
                }
              ]
            : undefined,
        actions: { rowClick: row => this.panelService.navigateToContact(row) },
        rowClass: row => (row._isDeleted ? 'deleted' : '')
      };
      this.panelService.panelList.subscribe(panels => {
        if (!panels) return;
        this.panels = panels;
        this.showDeleted(this.needToShowDeletedPanels);
        this.cdr.detectChanges();
      });
    });
  }

  showDeleted(show: boolean) {
    this.needToShowDeletedPanels = show;
    this.panelsToShow = show ? this.panels : this.panels.filter(p => !p._isDeleted);
  }

  ngOnInit(): void {}

  openEditPanelDialog(panel: PanelDetails): void {
    this.updatePanelFormModel!.formGroup.patchValue(panel);
    const dialogRef = this.dialog.open(FormComponent, {
      width: '80%',
      maxWidth: '540px',
      data: this.updatePanelFormModel,
      panelClass: 'contact-form'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const relevant = this.panels.find(u => u._id === result._id);
        this.api.savePanel(result).subscribe(savedPanel => {
          Object.keys(result).forEach(key => ((relevant as any)[key] = result[key]));
          this.panels = [...this.panels];
          this.snackBar.open('Panel was saved successfully', '', { duration: 2000 });
          this.cdr.markForCheck();
        });
      }
    });
  }

  openAddPanelDialog(uuid: number | undefined = undefined): void {
    this.addPanelFormModel.formGroup.reset();
    const op = (id: number) =>
      id
        .toString()
        .split('')
        .map((l: any) => (10 - +l) % 10)
        .join('');
    this.addPanelFormModel.formGroup.controls.id.setValidators(control => {
      const id = +control.value;
      const panelId = this.addPanelFormModel.formGroup.value.panelId;

      if (id && panelId && op(panelId) !== id.toString()) {
        return ['Something wrong'];
      }
      return null;
    });

    if (uuid) {
      this.addPanelFormModel.formGroup.patchValue({ panelId: uuid, id: +op(uuid) });

      // this.addPanelFormModel.formGroup.controls.panelId.disable();
      // this.addPanelFormModel.formGroup.controls.id.disable();
    }
    const dialogRef = this.dialog.open(FormComponent, {
      width: '80%',
      maxWidth: '540px',
      data: this.addPanelFormModel,
      panelClass: 'admin-form'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.panelService.addPanel(result);
      }
    });
  }

  scanPanel() {
    const dialogRef = this.dialog.open(ScannerComponent, {
      width: '80%',
      maxWidth: '540px'
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        this.openAddPanelDialog(+result.split('IMEI:')[1].split(';')[0]);
      }
    });
  }

  purgePanel(row: PanelDetails) {
    this.api.purge(row.panelId).subscribe(() => this.panelService.panelList.next(this.panels.filter(p => p.panelId !== row.panelId)));
  }

  deletePanel(row: PanelDetails, showDeleted: boolean) {
    row._isDeleted = !showDeleted;
    this.api.savePanel(row).subscribe(user => {
      const snackBarRef = this.snackBar.open('Panel was deleted successfully', 'Cancel', {
        duration: 2000
      });
      snackBarRef.onAction().subscribe(() => {
        row._isDeleted = false;
        this.api.savePanel(row).subscribe(() => this.snackBar.open('User was undeleted successfully', '', { duration: 2000 }));
      });
    });
  }
}
