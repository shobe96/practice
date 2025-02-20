import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, ValidatorFn, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { AuthRequest } from '../../../models/auth-request.model';
import { RegisterRequest } from '../../../models/register-request.model';
import { AuthFacadeService } from '../../../services/auth/auth.facade.service';
import { messageLife, StrongPasswordRegx } from '../../../shared/constants.model';
import { NgIf, AsyncPipe } from '@angular/common';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { MultiSelect } from 'primeng/multiselect';
import { Select } from 'primeng/select';
import { Toast } from 'primeng/toast';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
    imports: [NgIf, ReactiveFormsModule, InputText, Button, Tooltip, MultiSelect, Select, Toast, AsyncPipe]
})
export class RegisterComponent implements OnInit {
  showConfirmPassword = false;
  authRequest: AuthRequest = {};
  authFormGroup!: FormGroup;
  showPassword = false;
  icon: string = PrimeIcons.EYE;
  severity = true;
  tooltipMessage = "Show Password";
  isLoggin = false;
  tooltipConfirmMessage = "Show Confirm Password";
  confirmIcon = PrimeIcons.EYE;
  confirmSeverity = true;
  life = messageLife;

  authFacade: AuthFacadeService = inject(AuthFacadeService);

  ngOnInit(): void {
    this.authFacade.loadSelectOptions();
    this._buildForm();
  }

  submit(): void {
    this._registerUser();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    if (this.showPassword)
      this._setToggleOptions(PrimeIcons.EYE_SLASH, "Hide Password")
    else this._setToggleOptions(PrimeIcons.EYE, "Show Password");
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
    if (this.showConfirmPassword)
      this._setToggleConfirmOptions(PrimeIcons.EYE_SLASH, "Hide Confirm Password")
    else this._setToggleConfirmOptions(PrimeIcons.EYE, "Show Confirm Password");
  }

  private _buildForm(): void {
    this.authFormGroup = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
      password: new FormControl('', [Validators.required, Validators.pattern(StrongPasswordRegx)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.pattern(StrongPasswordRegx)]),
      selectedRoles: new FormControl([], [Validators.required]),
      employee: new FormControl({}, [Validators.required])
    }, { validators: [this._passwordMissmatchTest()] });
  }

  private _passwordMissmatchTest(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value.password;
      const confirmPassword = control.value.confirmPassword;
      return password === confirmPassword ? null : { passwordMissmatch: true }
    }
  }

  private _setToggleOptions(icon: string, tooltipMessage: string): void {
    this.icon = icon;
    this.severity = icon === PrimeIcons.EYE;
    this.tooltipMessage = tooltipMessage;
  }

  private _setToggleConfirmOptions(icon: string, tooltipMessage: string): void {
    this.confirmIcon = icon;
    this.confirmSeverity = icon === PrimeIcons.EYE;
    this.tooltipConfirmMessage = tooltipMessage;
  }

  private _registerUser(): void {
    const registerRequest: RegisterRequest = this._getFormValues();
    this.authFacade.registerUser(registerRequest);
  }

  private _getFormValues(): RegisterRequest {
    const registerRequest: RegisterRequest = {};
    registerRequest.username = this.authFormGroup.controls['username'].value;
    registerRequest.password = this.authFormGroup.controls['password'].value;
    if (!this.isLoggin) {
      registerRequest.roles = this.authFormGroup.controls['selectedRoles'].value;
      registerRequest.employee = this.authFormGroup.controls['employee'].value;
    }
    return registerRequest;
  }
}
