import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AdminService } from '../../../api/services/admin.service';
import { User } from '../../../api/models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TableOptions, FormComponent, LocaleService } from 'swagular/components';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { IRootObject } from '../../../api/locale.interface';
@Component({ selector: 'app-user', templateUrl: './user.component.html', styleUrls: ['./user.component.scss'] })
export class UserComponent implements OnInit {
  users: User[] = [];
  userFormModel = this.api.saveOrUpdateUserFormModel({
    formTitle: 'Add New User',
    displayProperties: ['firstName', 'lastName', 'email', 'phone', 'role'],
    localePath: 'userFormModel'
  });
  usersTableOptions?: TableOptions<User>;
  constructor(
    private api: AdminService,
    private dialog: NgDialogAnimationService,
    private snackBar: MatSnackBar,
    private localeService: LocaleService
  ) {
    api.users().subscribe(users => (this.users = users));
    localeService.locale.subscribe((locale: IRootObject | undefined) => {
      if (!locale) return;
      this.usersTableOptions = {
        columns: locale.userTableOptions.columns as any,
        rowActions: [
          {
            icon: 'edit',
            action: ($event, row) => this.openEditUserDialog(row)
          },
          {
            icon: 'delete',
            action: ($event, row) => this.deleteUser(row)
          }
        ]
      };
    });
  }

  ngOnInit(): void {}

  openEditUserDialog(user?: User): void {
    if (user) this.userFormModel.formGroup.patchValue(user);
    else this.userFormModel.formGroup.reset();
    const dialogRef = this.dialog.open(FormComponent, {
      width: '80%',
      maxWidth: '540px',
      data: this.userFormModel,
      panelClass: 'admin-form'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const relevant = this.users.find(u => u._id === result._id);
        this.api.saveOrUpdateUser(result).subscribe(savedUser => {
          if (!relevant) this.users = this.users.concat([savedUser]);
          else {
            Object.keys(result).forEach(key => ((relevant as any)[key] = result[key]));
            this.users = [...this.users];
          }
          this.snackBar.open('User was saved successfully', '', { duration: 2000 });
        });
      }
    });
  }

  deleteUser(row: User) {
    this.api.deleteUser(row).subscribe(user => {
      this.users = this.users.filter(u => u._id !== user._id);
      const snackBarRef = this.snackBar.open('User was deleted successfully', 'Cancel', {
        duration: 2000
      });
      snackBarRef.onAction().subscribe(() => {
        this.users = this.users.concat([user]);
        this.api.unDeleteUser(row).subscribe(() => this.snackBar.open('User was undeleted successfully', '', { duration: 2000 }));
      });
    });
  }
}
