import { Component } from '@angular/core';
import { AuthService } from '../api/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
    <div class="main">
      <div class="container center" fxLayout="column">
        <swagular-form class="container" [model]="model" (submit)="login()"></swagular-form>
        <a class="reset-password" (click)="resetPassword()" role="button">Reset password</a>
        <span fxFlex="20px" *ngIf="loginError">{{ loginError }}</span>
      </div>
    </div>
  `,
  styleUrls: ['./auth.component.scss']
})
export class LoginComponent {
  loginError?: string;
  model = this.service.loginFormModel({ localePath: 'loginForm', fields: [{ key: 'email' }, { key: 'password', type: 'password' }] });
  constructor(private service: AuthService, private router: Router) {}
  resetPassword() {
    if (!this.model.formGroup.controls.email.invalid)
      this.service.resetPassword(this.model.formGroup.value.email).subscribe(
        _ => (this.loginError = 'Password reset was send to you mail!'),
        error => (this.loginError = 'There is some problem with your account, please contact with the admin!')
      );
    else {
      this.loginError = 'Please insert valid email!';
    }
  }
  login() {
    this.service.login(this.model.formGroup.value).subscribe(
      user => {
        this.router.navigate(['']).catch(console.log);
      },
      error => {
        this.loginError = 'user or password is incorrect';
        console.log(error);
      }
    );
  }
}
