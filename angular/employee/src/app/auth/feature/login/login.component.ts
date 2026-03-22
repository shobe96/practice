import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { AuthRequest } from '../../data-access/auth-request.model';
import { AuthFacadeService } from '../../data-access/auth.facade.service';
import { RegisterRequest } from '../../data-access/register-request.model';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { ProgressSpinner } from 'primeng/progressspinner';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    ReactiveFormsModule,
    InputText,
    Button,
    Tooltip,
    ProgressSpinner,
    TranslatePipe,
  ],
})
export class LoginComponent {
  authRequest: AuthRequest = {};

  showPassword = signal(false);
  icon = computed(() =>
    this.showPassword() ? PrimeIcons.EYE_SLASH : PrimeIcons.EYE
  );
  severity = computed(() => !this.showPassword());
  tooltipMessage = computed(() => {
    this.currentLang(); 
    
    return this.showPassword() 
      ? this._translateService.instant("AUTH.LOGIN.HIDE") 
      : this._translateService.instant("AUTH.LOGIN.SHOW");
  });

  private readonly _signalInitValue = {
    employees: [],
    roles: [],
    menuItems: [],
    loading: false,
  };
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _translateService = inject(TranslateService);

  readonly currentLang = toSignal(
    this._translateService.onLangChange.pipe(
      map(event => event.lang),
      startWith(this._translateService.getCurrentLang() || 'en')
    )
  );

  authFormGroup = this._formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  private _authFacade = inject(AuthFacadeService);

  viewModel = toSignal(this._authFacade.viewModel$, {
    initialValue: this._signalInitValue,
  });

  submit(): void {
    this._loginUser();
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  private _loginUser(): void {
    const registerRequest = this._getFormValues();
    this._authFacade.loginUser(registerRequest);
  }

  private _getFormValues(): RegisterRequest {
    const { username, password } = this.authFormGroup.value;

    const registerRequest: RegisterRequest = {
      username: username ?? undefined,
      password: password ?? undefined,
    };

    return registerRequest;
  }

  usernameField = computed(() => 
    this.currentLang() === 'rs' ? 'Korisničko ime' : 'Username'
  );

  passwordField = computed(() => 
    this.currentLang() === 'rs' ? 'Šifra' : 'Password'
  );

  get submitTranslation(): string {
    return this._translateService.instant("COMMON.SUBMIT");
  }

  private _getFieldTranslation(enValue: string, rsValue: string): string {
    const lang = this._translateService.getCurrentLang() || 'en';
    return lang === 'rs' ? rsValue : enValue;
  }
}
