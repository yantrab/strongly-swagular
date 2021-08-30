import { Component } from '@angular/core';
import { AuthService, SetPasswordFormGroupType } from '../api/services/auth.service';
import { FormModel } from 'swagular/models';
import { ActivatedRoute } from '@angular/router';

@Component({ selector: 'app-login', templateUrl: './auth.component.html', styleUrls: ['./auth.component.scss'] })
export class SetPasswordComponent {
  loginError?: string;
  model?: FormModel<SetPasswordFormGroupType>;
  token?: string;
  email?: string;

  constructor(private service: AuthService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      this.token = params.token;
      this.model = this.service.setPasswordFormModel(
        {
          localePath: 'setPasswordForm',
          fields: [{ key: 'email' }, { key: 'password', type: 'password' }, { key: 'rePassword', type: 'password' }]
        },
        { email: params.email } as any
      );
    });
  }

  login() {
    this.service.setPassword(this.token!, this.model!.formGroup.value).subscribe(
      res => {
        window.location.href = window.location.origin;
      },
      error => {
        this.loginError = 'user or password is incorrect';
        console.log(error);
      }
    );
  }
}
