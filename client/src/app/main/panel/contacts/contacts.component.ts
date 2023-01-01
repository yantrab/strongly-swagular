import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Contact, ContactSchema } from '../../../api/models/contact';
import { PanelService as API } from '../../../api/services/panel.service';
import { ActivatedRoute } from '@angular/router';
import { FormComponent, LocaleService, TableOptions } from 'swagular/components';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PanelService } from '../panel.service';
import { Lang } from '../../../api/models/lang';
import { Validators } from '@angular/forms';
import { Contacts } from '../../../api/models/contacts';
import { Source } from '../../../api/models/source';
import { ChangeItem } from '../../../api/models/change-item';
import { SwagularService } from 'swagular';
import { NgDialogAnimationService } from 'ng-dialog-animation';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsComponent implements OnInit {
  contactsTableOptions?: TableOptions<Contact>;
  columns = ['name1', 'name2', 'tel1', 'tel2', 'tel3', 'code', 'ref', 'apartment'];
  panelId?: number;
  updateContactFormModel = this.swagularService.getFormModel<Contact>(ContactSchema, {
    localePath: 'updateContactFormModel',
    displayProperties: this.columns as any
  });

  constructor(
    private api: API,
    private swagularService: SwagularService,
    private panelService: PanelService,
    private route: ActivatedRoute,
    private localeService: LocaleService,
    private cdr: ChangeDetectorRef,
    private dialog: NgDialogAnimationService,
    private snackBar: MatSnackBar
  ) {
    this.localeService.getLocaleItem('contactsTableOptions').then(options => {
      this.contactsTableOptions = {
        columns: options.columns,
        actions: { rowClick: row => this.openEditContactDialog(row) }
      };
      this.panelId = route.snapshot.params.panelId;
      this.panelService.getContacts(this.panelId!).subscribe(contacts => {
        this._contacts = contacts;
        this.cdr.markForCheck();
      });
    });

    if (this.panelService.currentPanel?.direction === Lang.he) {
      this.updateContactFormModel.formGroup.controls.name1?.setValidators(Validators.maxLength(12));
      this.updateContactFormModel.formGroup.controls.name2?.setValidators(Validators.maxLength(12));
    }
  }

  _contacts?: Contacts;

  get contacts() {
    return this._contacts!;
  }

  openEditContactDialog(contact: Contact): void {
    this.updateContactFormModel.formGroup.reset(contact);
    const dialogRef = this.dialog.open(FormComponent, {
      width: '80%',
      maxWidth: '540px',
      data: this.updateContactFormModel,
      panelClass: 'contact-form'
    });

    dialogRef.afterClosed().subscribe((result: Contact) => {
      if (result) {
        const keys = Object.keys(result) as Array<keyof Contact>;
        const relevant = this.contacts.list[result.index];
        const changes: ChangeItem[] = [];
        keys.forEach((key: keyof Contact) => {
          if (relevant[key] !== result[key] || (result[key] && !relevant[key])) {
            if (!this.contacts.changes.find(c => c.index === result.index && c.key === key && c.previewsValue !== undefined)) {
              changes.push({ index: result.index, key, previewsValue: relevant[key] as string, source: Source.client });
            }
          }
        });
        this.contacts.changes.push(...changes);
        this.api.updateContact(this.panelId!, { contact: result, changes }).subscribe(savedPanel => {
          keys.forEach(key => ((relevant as any)[key] = result[key]));
          this.contacts.list = [...this.contacts.list];
          this.panelService.addBackup(this.contacts);
          this.snackBar.open('Panel was saved successfully', '', { duration: 2000 });
          this.cdr.markForCheck();
        });
      }
    });
  }

  ngOnInit(): void {}

  getColor(index: number, key: string) {
    // console.log(index + property);
    const source = this.contacts.changes.find(c => c.index === index && c.key === key)?.source;
    if (source === Source.client) {
      return '#ecfb9b';
    }
    if (source === Source.Panel) {
      return '#8fff8f';
    }

    if (source === Source.PanelProgress) {
      return 'orangered';
    }
    return undefined;
  }
}
