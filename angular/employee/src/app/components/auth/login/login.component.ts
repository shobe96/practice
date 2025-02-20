import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { AuthRequest } from '../../../models/auth-request.model';
import { AuthFacadeService } from '../../../services/auth/auth.facade.service';
import { RegisterRequest } from '../../../models/register-request.model';
import { InputText } from 'primeng/inputtext';
import { NgIf } from '@angular/common';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    ReactiveFormsModule,
    InputText,
    NgIf,
    Button,
    Tooltip
  ]
})
export class LoginComponent implements OnInit {

  showConfirmPassword = false;
  authRequest: AuthRequest = {};
  authFormGroup!: FormGroup;
  showPassword = false;
  icon: string = PrimeIcons.EYE;
  severity = true;
  tooltipMessage = "Show Password";

  authFacade: AuthFacadeService = inject(AuthFacadeService);
  private _formBuilder: FormBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this._buildForm();
  }

  submit(): void {
    this._loginUser();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    if (this.showPassword)
      this._setToggleOptions(PrimeIcons.EYE_SLASH, "Hide Password")
    else this._setToggleOptions(PrimeIcons.EYE, "Show Password");
  }

  private _buildForm(): void {
    this.authFormGroup = this._formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  private _setToggleOptions(icon: string, tooltipMessage: string): void {
    this.icon = icon;
    this.severity = icon === PrimeIcons.EYE;
    this.tooltipMessage = tooltipMessage;
  }

  private _loginUser(): void {
    const registerRequest: RegisterRequest = this._getFormValues();
    this.authFacade.loginUser(registerRequest);
  }

  private _getFormValues(): RegisterRequest {
    const registerRequest: RegisterRequest = {};
    registerRequest.username = this.authFormGroup.controls['username'].value;
    registerRequest.password = this.authFormGroup.controls['password'].value;
    return registerRequest;
  }
}
