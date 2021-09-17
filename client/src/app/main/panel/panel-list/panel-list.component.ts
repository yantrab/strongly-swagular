import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormComponent, LocaleService, TableOptions } from 'swagular/components';
import { MatDialog } from '@angular/material/dialog';
import { PanelService as Api } from '../../../api/services/panel.service';
import { PanelDetails } from '../../../api/models/panel-details';
import { PanelService } from '../panel.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-panel',
  templateUrl: './panel-list.component.html',
  styleUrls: ['./panel-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PanelListComponent implements OnInit {
  panels: PanelDetails[] = [];
  get panelsToShow() {
    return this.showDeleted ? this.panels : this.panels.filter(p => !p._isDeleted);
  }
  addPanelFormModel = this.api.addNewPanelFormModel({
    localePath: 'addPanelFormModel',
    displayProperties: ['panelId', 'id', 'address', 'phoneNumber', 'contactName', 'contactPhone', 'direction']
  });

  updatePanelFormModel = this.api.savePanelFormModel({
    localePath: 'savePanelFormModel',
    displayProperties: ['address', 'phoneNumber', 'contactName', 'contactPhone']
  });
  panelsTableOptions?: TableOptions<PanelDetails>;
  showDeleted = false;
  constructor(
    private api: Api,
    private panelService: PanelService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private localeService: LocaleService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.localeService.getLocaleItem('panelsTableOptions').then(options => {
      this.panelsTableOptions = {
        columns: options.columns,
        rowActions: [
          { icon: 'edit', action: ($event, row) => this.openEditPanelDialog(row) },
          { icon: 'delete', action: ($event, row) => this.deletePanel(row) },
          { icon: 'manage_accounts', action: ($event, row) => this.panelService.navigateToContact(row) },
          { icon: 'settings', action: ($event, row) => this.panelService.navigateToSettings(row) }
        ]
      };
      this.cdr.detectChanges();
    });
    api.list().subscribe(panels => {
      this.panels = panels;
      this.cdr.detectChanges();
    });
  }

  ngOnInit(): void {}

  openEditPanelDialog(panel: PanelDetails): void {
    this.updatePanelFormModel.formGroup.patchValue(panel);
    const dialogRef = this.dialog.open(FormComponent, {
      width: '80%',
      maxWidth: '540px',
      data: this.updatePanelFormModel,
      panelClass: 'admin-form'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const relevant = this.panels.find(u => u._id === result._id);
        this.api.savePanel(result).subscribe(savedPanel => {
          Object.keys(result).forEach(key => ((relevant as any)[key] = result[key]));
          this.panels = [...this.panels];
          this.snackBar.open('Panel was saved successfully', '', { duration: 2000 });
        });
      }
    });
  }

  openAddPanelDialog(): void {
    this.addPanelFormModel.formGroup.controls.id.setValidators(control => {
      const id = +control.value;
      const panelId = this.addPanelFormModel.formGroup.value.panelId;

      if (
        id &&
        panelId &&
        +panelId
          .toString()
          .split('')
          .map((l: any) => (10 - +l) % 10)
          .join() !== id
      ) {
        // this.addPanelFormModel.formGroup.controls.id.setErrors(['Something wrong!']);
        return ['Something wrong'];
      }
      return null;
    });
    this.addPanelFormModel.formGroup.reset();
    const dialogRef = this.dialog.open(FormComponent, {
      width: '80%',
      maxWidth: '540px',
      data: this.addPanelFormModel,
      panelClass: 'admin-form'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.addNewPanel(result).subscribe(
          savedPanel => {
            this.panels = this.panels.concat([savedPanel]);
            this.cdr.detectChanges();
            this.snackBar.open('Panel was saved successfully', '', { duration: 2000 });
          },
          error => {
            console.log(JSON.stringify(error));
            this.snackBar.open(error.error?.message, '', { duration: 5000 });
          }
        );
      }
    });
  }

  deletePanel(row: PanelDetails) {
    row._isDeleted = true;
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