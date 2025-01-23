import { Component, inject, OnInit } from '@angular/core';
import { AuthRequest } from '../../../models/auth-request.model';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { StrongPasswordRegx } from '../../../shared/constants.model';
import { PrimeIcons } from 'primeng/api';
import { Router } from '@angular/router';
import { RegisterRequest } from '../../../models/register-request.model';
import { Severity } from '../../../shared/custom-types';
import { AuthFacadeService } from '../../../services/auth/auth.facade.service';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss',
  standalone: false
})
export class AuthFormComponent implements OnInit {
  public showConfirmPassword: any;
  public authRequest: AuthRequest = {};
  public authFormGroup!: FormGroup;
  public showPassword: boolean = false;
  public icon: string = PrimeIcons.EYE;
  public severity: Severity = "success";
  public tooltipMessage: string = "Show Password";
  public isLoggin: boolean = false;
  public tooltipConfirmMessage: string = "Show Confirm Password";
  public confirmIcon: string = PrimeIcons.EYE;
  public confirmSeverity: Severity = "success";

  private formBuilder: FormBuilder = inject(FormBuilder);
  private _router: Router = inject(Router);
  authFacade: AuthFacadeService = inject(AuthFacadeService);

  ngOnInit(): void {
    this.isLoggin = this._router.url.includes("login");
    this.authFacade.loadSelectOptions(this.isLoggin);
    this.buildForm();
  }

  public submit(): void {
    this.isLoggin ? this.loginUser() : this.registerUser();
  }

  private buildForm(): void {
    if (this.isLoggin) {
      this.authFormGroup = this.formBuilder.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
      });
    } else {
      this.authFormGroup = new FormGroup({
        username: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
        password: new FormControl('', [Validators.required, Validators.pattern(StrongPasswordRegx)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.pattern(StrongPasswordRegx)]),
        selectedRoles: new FormControl([], [Validators.required]),
        employee: new FormControl({}, [Validators.required])
      }, { validators: [this.passwordMissmatchTest()] });
    }

  }

  public togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.showPassword ? this.setToggleOptions(PrimeIcons.EYE_SLASH, "danger", "Hide Password") : this.setToggleOptions(PrimeIcons.EYE, "success", "Show Password");
  }

  public toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
    this.showConfirmPassword ? this.setToggleOptions(PrimeIcons.EYE_SLASH, "danger", "Hide Confirm Password") : this.setToggleOptions(PrimeIcons.EYE, "success", "Show Confirm Password");
  }

  private passwordMissmatchTest(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value.password;
      const confirmPassword = control.value.confirmPassword;
      return password === confirmPassword ? null : { passwordMissmatch: true }
    }
  }

  private setToggleOptions(icon: string, severity: Severity, tooltipMessage: string): void {
    this.icon = icon;
    this.severity = severity;
    this.tooltipMessage = tooltipMessage;
  }

  private registerUser(): void {
    const registerRequest: RegisterRequest = this.getFormValues();
    this.authFacade.registerUser(registerRequest);
  }
  private loginUser(): void {
    const registerRequest: RegisterRequest = this.getFormValues();
    this.authFacade.loginUser(registerRequest);
  }

  private getFormValues(): RegisterRequest {
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
