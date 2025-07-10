import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormGroup, Validators, FormControl, ValidatorFn, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { AuthRequest } from '../../data-access/auth-request.model';
import { RegisterRequest } from '../../data-access/register-request.model';
import { AuthFacadeService } from '../../data-access/auth.facade.service';
import { messageLife, StrongPasswordRegx } from '../../../shared/constants.model';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { MultiSelect } from 'primeng/multiselect';
import { Select } from 'primeng/select';
import { Toast } from 'primeng/toast';
import { ProgressSpinner } from 'primeng/progressspinner';
import { toSignal } from '@angular/core/rxjs-interop';
import { ValidationMessagesComponent } from '../../../shared/ui/validation-messages/validation-messages.component';
import { PasswordRequirementsComponent } from '../../ui/password-requirements/password-requirements.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  imports: [
    ReactiveFormsModule,
    InputText,
    Button,
    Tooltip,
    MultiSelect,
    Select,
    Toast,
    ProgressSpinner,
    ValidationMessagesComponent,
    PasswordRequirementsComponent
  ]
})
export class RegisterComponent implements OnInit {
  authRequest: AuthRequest = {};
  authFormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]),
    password: new FormControl('', [Validators.required, Validators.pattern(StrongPasswordRegx)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.pattern(StrongPasswordRegx)]),
    selectedRoles: new FormControl([], [Validators.required]),
    employee: new FormControl({}, [Validators.required])
  }, { validators: [this._passwordMissmatchTest()] });;

  showPassword = signal(false);
  icon = computed(() => this.showPassword() ? PrimeIcons.EYE_SLASH : PrimeIcons.EYE);
  severity = computed(() => !this.showPassword());
  tooltipMessage = computed(() => this.showPassword() ? 'Hide Password' : 'Show Password');

  showConfirmPassword = signal(false);
  confirmIcon = computed(() => this.showConfirmPassword() ? PrimeIcons.EYE_SLASH : PrimeIcons.EYE);
  confirmSeverity = computed(() => !this.showConfirmPassword());
  tooltipConfirmMessage = computed(() => this.showConfirmPassword() ? 'Hide Password' : 'Show Password');

  life = messageLife;

  private _authFacade: AuthFacadeService = inject(AuthFacadeService);

  private readonly _signalInitValue = { employees: [], roles: [], menuItems: [], loading: false }
  viewModel = toSignal(this._authFacade.viewModel$, { initialValue: this._signalInitValue });

  ngOnInit(): void {
    this._authFacade.loadSelectOptions();
  }

  submit(): void {
    this._registerUser();
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  isInvalid(controlName: string): boolean {
    const control = this.authFormGroup.get(controlName);
    return !!control && control.invalid && control.dirty;
  }


  private _passwordMissmatchTest(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value.password;
      const confirmPassword = control.value.confirmPassword;
      return password === confirmPassword ? null : { passwordMissmatch: true }
    }
  }

  private _registerUser(): void {
    const registerRequest: RegisterRequest = this._getFormValues();
    this._authFacade.registerUser(registerRequest);
  }

  private _getFormValues(): RegisterRequest {
    const { username, password, selectedRoles, employee } = this.authFormGroup.value;

    const registerRequest: RegisterRequest = {
      username: username ?? undefined,
      password: password ?? undefined,
      roles: selectedRoles ?? undefined,
      employee: employee ?? undefined
    };

    return registerRequest;
  }
}
