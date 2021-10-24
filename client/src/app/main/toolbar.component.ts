import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { User } from '../api/models/user';
import { AuthService } from '../auth/auth.service';
import { LocaleService } from 'swagular/components';
import { IMainToolBar, IRootObject } from '../api/locale.interface';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  template: `
    <mat-toolbar *ngIf="locale">
      <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Example icon-button with a menu">
        <mat-icon>more_vert</mat-icon>
      </button>
      <mat-menu #menu="matMenu">
        <button mat-menu-item [matMenuTriggerFor]="language">
          <mat-icon>language</mat-icon>
          <span>{{ locale.language }}</span>
        </button>
        <button mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon>
          <span>{{ locale.logout }}</span>
        </button>
      </mat-menu>
      <mat-menu #language="matMenu">
        <button (click)="changeLang('he')" mat-menu-item>{{ locale.hebrew }}</button>
        <button (click)="changeLang('en')" mat-menu-item>{{ locale.english }}</button>
      </mat-menu>
      <a mat-button routerLink="panel">{{ locale.panels }}</a>
      <a mat-button routerLink="admin" *ngIf="user?.role === 'admin'">{{ locale.admin }}</a>
      <span style="flex: 1 1 auto;"></span>
      <!--      <span [fxShow.lt-md]="false"> Hello {{ user?.firstName }} {{ user?.lastName }}</span>-->
    </mat-toolbar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {
  user?: User;
  locale?: IMainToolBar;
  constructor(private authService: AuthService, public localeService: LocaleService, private cd: ChangeDetectorRef) {
    authService.user$.subscribe(user => (this.user = user));
    this.localeService.locale.subscribe((locale: IRootObject | undefined) => {
      this.locale = locale?.mainToolBar;
      this.cd.markForCheck();
    });
  }

  logout() {
    this.authService.logout().subscribe(() => {});
  }
  changeLang(lang: string) {
    this.localeService.language = lang;
  }
}
