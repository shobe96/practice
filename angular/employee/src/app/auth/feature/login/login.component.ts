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
  ]
})
export class LoginComponent {

  authRequest: AuthRequest = {};

  showPassword = signal(false);
  icon = computed(() => this.showPassword() ? PrimeIcons.EYE_SLASH : PrimeIcons.EYE);
  severity = computed(() => !this.showPassword());
  tooltipMessage = computed(() => this.showPassword() ? 'Hide Password' : 'Show Password');

  private readonly _signalInitValue = { employees: [], roles: [], menuItems: [], loading: false }
  private readonly _formBuilder = inject(FormBuilder);

  authFormGroup = this._formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  private _authFacade = inject(AuthFacadeService);

  viewModel = toSignal(this._authFacade.viewModel$, { initialValue: this._signalInitValue });

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

}
