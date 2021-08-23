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
      this.model = {
        formGroup: this.service.setPasswordFormGroup({ email: params.email } as any),
        formTitle: 'Set new password',
        formSaveButtonTitle: 'Save',
        fields: [
          { key: 'email', label: 'Email', },
          { key: 'password', type: 'password', label: 'Password' },
          { key: 'rePassword', type: 'password', label: 'Insert Password Again' }
        ]
      };
      // this.model.formGroup.setValue({email: params.email} as any);
    });
  }

  login() {
    this.service.setPassword({ token: this.token!, body: this.model!.formGroup.value }).subscribe(
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
