import { Component } from '@angular/core';
import { User } from '../api/models/user';
import { AuthService } from '../auth/auth.service';
import { LocaleService } from 'swagular/components';

@Component({
  selector: 'app-toolbar',
  template: `
    <mat-toolbar>
      <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Example icon-button with a menu">
        <mat-icon>more_vert</mat-icon>
      </button>
      <mat-menu #menu="matMenu">
        <button mat-menu-item [matMenuTriggerFor]="language">
          <mat-icon>language</mat-icon>
          <span>language</span>
        </button>
        <button mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon>
          <span>logout</span>
        </button>
      </mat-menu>
      <mat-menu #language="matMenu">
        <button (click)="changeLang('he')" mat-menu-item>Hebrew</button>
        <button (click)="changeLang('en')" mat-menu-item>English</button>
      </mat-menu>
      <a mat-button>Some page</a>
      <a mat-button routerLink="admin" *ngIf="user?.role === 'admin'">admin</a>
      <span style="flex: 1 1 auto;"></span>
      <span> Hello {{ user?.firstName }} {{ user?.lastName }}</span>
    </mat-toolbar>
  `
})
export class ToolbarComponent {
  user?: User;
  constructor(private authService: AuthService, private localeService: LocaleService) {
    authService.user$.subscribe(user => (this.user = user));
  }

  logout() {
    this.authService.logout().subscribe(() => {});
  }
  changeLang(lang: string) {
    this.localeService.language = lang;
  }
}
