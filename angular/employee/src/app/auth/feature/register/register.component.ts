import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { AuthRequest } from '../../data-access/auth-request.model';
import { RegisterRequest } from '../../data-access/register-request.model';
import { AuthFacadeService } from '../../data-access/auth.facade.service';
import {
  messageLife,
  StrongPasswordRegx,
} from '../../../shared/constants.model';
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
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { map, startWith } from 'rxjs';

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
    PasswordRequirementsComponent,
    TranslatePipe
  ],
})
export class RegisterComponent implements OnInit {
  authRequest: AuthRequest = {};
  authFormGroup = new FormGroup(
    {
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(StrongPasswordRegx),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(StrongPasswordRegx),
      ]),
      selectedRoles: new FormControl([], [Validators.required]),
      employee: new FormControl({}, [Validators.required]),
    },
    { validators: [this._passwordMissmatchTest()] }
  );

  private _authFacade: AuthFacadeService = inject(AuthFacadeService);
  private readonly _translateService = inject(TranslateService);

  showPassword = signal(false);
  icon = computed(() =>
    this.showPassword() ? PrimeIcons.EYE_SLASH : PrimeIcons.EYE
  );
  severity = computed(() => !this.showPassword());
  tooltipMessage = computed(() => {
    this.currentLang();
    return this.showPassword()
      ? this._translateService.instant('AUTH.REGISTER.HIDE_PASSWORD')
      : this._translateService.instant('AUTH.REGISTER.SHOW_PASSWORD');
  });

  showConfirmPassword = signal(false);
  confirmIcon = computed(() =>
    this.showConfirmPassword() ? PrimeIcons.EYE_SLASH : PrimeIcons.EYE
  );
  confirmSeverity = computed(() => !this.showConfirmPassword());
  tooltipConfirmMessage = computed(() => {
    this.currentLang();
    return this.showConfirmPassword()
      ? this._translateService.instant('AUTH.REGISTER.HIDE_PASSWORD')
      : this._translateService.instant('AUTH.REGISTER.SHOW_PASSWORD');
  });

  life = messageLife;

  readonly currentLang = toSignal(
    this._translateService.onLangChange.pipe(
      map((event) => event.lang),
      startWith(this._translateService.getCurrentLang() || 'en')
    )
  );

  private readonly _signalInitValue = {
    employees: [],
    roles: [],
    menuItems: [],
    loading: false,
  };
  viewModel = toSignal(this._authFacade.viewModel$, {
    initialValue: this._signalInitValue,
  });

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

  usernameKey = 'AUTH.REGISTER.USERNAME';

  private _passwordMissmatchTest(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value.password;
      const confirmPassword = control.value.confirmPassword;
      return password === confirmPassword ? null : { passwordMissmatch: true };
    };
  }

  private _registerUser(): void {
    const registerRequest: RegisterRequest = this._getFormValues();
    this._authFacade.registerUser(registerRequest);
  }

  private _getFormValues(): RegisterRequest {
    const { username, password, selectedRoles, employee } =
      this.authFormGroup.value;

    const registerRequest: RegisterRequest = {
      username: username ?? undefined,
      password: password ?? undefined,
      roles: selectedRoles ?? undefined,
      employee: employee ?? undefined,
    };

    return registerRequest;
  }

  ussernamePlaceholder = computed(() => {
    this.currentLang();
    return this._translateService.instant(this.usernameKey);
  });

  minLengthTranslation(key: string, length: number): string {
    const field = this._translateService.instant(key);
    return this._translateService.instant('VALIDATIONS.MIN_LENGTH', {
      field: field,
      length: length,
    });
  }

  maxLengthTranslation(key: string, length: number): string {
    const field = this._translateService.instant(key);
    return this._translateService.instant('VALIDATIONS.MAX_LENGTH', {
      field: field,
      length: length,
    });
  }

  requiredTranslation(key: string): string {
    const field = this._translateService.instant(key);
    return this._translateService.instant('VALIDATIONS.REQUIRED', {
      field: field,
    });
  }

  get submitLabel(): string {
    return this._translateService.instant('COMMON.SUBMIT');
  }
}
