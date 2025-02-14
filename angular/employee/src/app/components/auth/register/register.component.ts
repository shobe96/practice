import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { AuthRequest } from '../../../models/auth-request.model';
import { RegisterRequest } from '../../../models/register-request.model';
import { AuthFacadeService } from '../../../services/auth/auth.facade.service';
import { messageLife, StrongPasswordRegx } from '../../../shared/constants.model';
import { Severity } from '../../../shared/custom-types';

@Component({
  selector: 'app-register',
  standalone: false,

  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  showConfirmPassword = false;
  authRequest: AuthRequest = {};
  authFormGroup!: FormGroup;
  showPassword = false;
  icon: string = PrimeIcons.EYE;
  severity: Severity = "success";
  tooltipMessage = "Show Password";
  isLoggin = false;
  tooltipConfirmMessage = "Show Confirm Password";
  confirmIcon = PrimeIcons.EYE;
  confirmSeverity: Severity = "success";
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
      this._setToggleOptions(PrimeIcons.EYE_SLASH, "danger", "Hide Password")
    else this._setToggleOptions(PrimeIcons.EYE, "success", "Show Password");
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
    if (this.showConfirmPassword)
      this._setToggleConfirmOptions(PrimeIcons.EYE_SLASH, "danger", "Hide Confirm Password")
    else this._setToggleConfirmOptions(PrimeIcons.EYE, "success", "Show Confirm Password");
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

  private _setToggleOptions(icon: string, severity: Severity, tooltipMessage: string): void {
    this.icon = icon;
    this.severity = severity;
    this.tooltipMessage = tooltipMessage;
  }

  private _setToggleConfirmOptions(icon: string, severity: Severity, tooltipMessage: string): void {
    this.confirmIcon = icon;
    this.confirmSeverity = severity;
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
