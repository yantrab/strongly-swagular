import { Component } from '@angular/core';
import { AuthService, SetPasswordFormGroupType } from '../api/services/auth.service';
import { FormModel } from 'swagular/models';
import { ActivatedRoute } from '@angular/router';

@Component({ selector: 'app-login', templateUrl: './auth.component.html', styleUrls: ['./auth.component.scss'] })
export class SetPasswordComponent {
  loginError?: string;
  model: FormModel<SetPasswordFormGroupType> = {
    formGroup: this.service.setPasswordFormGroup(),
    formTitle: 'Set new password',
    formSaveButtonTitle: 'Save',
    fields: [
      { key: 'email', label: ' Email' },
      { key: 'password', type: 'password', label: 'Password' },
      { key: 'rePassword', type: 'password', label: 'Insert Password Again' }
    ]
  };
  token?: string;
  constructor(private service: AuthService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      this.token = params.token;
    });
  }

  login() {
    this.service.setPassword({ token: this.token!, body: this.model.formGroup.value }).subscribe(
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
