import { Component } from '@angular/core';
import { User } from '../api/models/user';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-toolbar',
  template: `
    <mat-toolbar>
      <mat-menu #menu="matMenu">
        <button mat-menu-item>
          <mat-icon>dialpad</mat-icon>
          <span>Redial</span>
        </button>
        <button mat-menu-item disabled>
          <mat-icon>voicemail</mat-icon>
          <span>Check voice mail</span>
        </button>
        <button mat-menu-item>
          <mat-icon>notifications_off</mat-icon>
          <span>Disable alerts</span>
        </button>
      </mat-menu>
      <a mat-button>Some page</a>
      <a mat-button routerLink="admin" *ngIf="user?.role === 'admin'">admin</a>
      <span style="flex: 1 1 auto;"></span>
      <span> Hello {{ user?.firstName }} {{ user?.lastName }}</span>
      <a (click)="logout()" mat-button>logout</a>
    </mat-toolbar>
  `
})
export class ToolbarComponent {
  user?: User;
  constructor(private authService: AuthService) {
    authService.user$.subscribe(user => (this.user = user));
  }

  logout() {
    this.authService.logout().subscribe(() => {});
  }
}
