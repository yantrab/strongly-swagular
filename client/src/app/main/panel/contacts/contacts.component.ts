import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Contact } from '../../../api/models/contact';
import { PanelService } from '../../../api/services/panel.service';
import { ActivatedRoute } from '@angular/router';
import { FormComponent, LocaleService, TableOptions } from 'swagular/components';
import { PanelDetails } from '../../../api/models/panel-details';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  contactsTableOptions?: TableOptions<Contact>;
  _contacts?: Contact[];
  panelId?: number;
  get contacts() {
    return this._contacts!;
  }
  updateContactFormModel = this.api.updateContactFormModel({
    localePath: 'updateContactFormModel',
    displayProperties: ['name1', 'name2', 'tel1', 'tel2', 'tel3', 'tel4', 'tel5', 'tel6', 'code', 'ref', 'apartment']
  });
  constructor(
    private api: PanelService,
    private route: ActivatedRoute,
    private localeService: LocaleService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.localeService.getLocaleItem('contactsTableOptions').then(options => {
      this.contactsTableOptions = {
        columns: options.columns,
        rowActions: [{ icon: 'edit', action: ($event, row) => this.openEditContactDialog(row) }]
      };
      this.panelId = route.snapshot.params.panelId;
      this.api.contacts(this.panelId!).subscribe(contacts => {
        this._contacts = contacts;
        this.cdr.detectChanges();
      });
    });
  }

  openEditContactDialog(contact: Contact): void {
    this.updateContactFormModel.formGroup.reset(contact);
    // this.updateContactFormModel.formGroup.patchValue(contact);
    const dialogRef = this.dialog.open(FormComponent, {
      width: '80%',
      maxWidth: '540px',
      data: this.updateContactFormModel,
      panelClass: 'admin-form'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const relevant = this.contacts.find(u => u.index === result.index);
        this.api.updateContact(this.panelId!, result).subscribe(savedPanel => {
          Object.keys(result).forEach(key => ((relevant as any)[key] = result[key]));
          this._contacts = [...this.contacts];
          this.snackBar.open('Panel was saved successfully', '', { duration: 2000 });
        });
      }
    });
  }
  ngOnInit(): void {}
}
