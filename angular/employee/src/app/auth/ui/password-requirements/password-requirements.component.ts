import { Component, computed, inject, Input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-password-requirements',
  imports: [],
  templateUrl: './password-requirements.component.html',
  styleUrl: './password-requirements.component.scss',
})
export class PasswordRequirementsComponent {
  @Input() password: string | null | undefined = '';
  private _translateService = inject(TranslateService);

  readonly currentLang = toSignal(
    this._translateService.onLangChange.pipe(
      map((event) => event.lang),
      startWith(this._translateService.getCurrentLang() || 'en')
    )
  );

  rules = computed(() => {
    this.currentLang();
    const pwd = this.password ?? '';
    return [
      {
        valid: this._hasUppercase(pwd),
        message: this._translateService.instant('VALIDATIONS.PASSWORD.ONE_UPPER_CASE'),
      },
      {
        valid: this._hasLowercase(pwd),
        message: this._translateService.instant('VALIDATIONS.PASSWORD.ONE_LOWER_CASE'),
      },
      { valid: this._hasDigit(pwd), message: this._translateService.instant('VALIDATIONS.PASSWORD.ONE_DIGIT') },
      {
        valid: this._hasSpecialChar(pwd),
        message: this._translateService.instant('VALIDATIONS.PASSWORD.ONE_SPECIAL_CHARACTER'),
      },
      {
        valid: this._hasMinLength(pwd),
        message: this._translateService.instant('VALIDATIONS.PASSWORD.MIN_LENGTH'),
      },
    ];
  });
  /*
  get rules() {
    const pwd = this.password ?? '';
    return [
      { valid: this._hasUppercase(pwd), message: 'At least one uppercase letter.' },
      { valid: this._hasLowercase(pwd), message: 'At least one lowercase letter.' },
      { valid: this._hasDigit(pwd), message: 'At least one digit.' },
      { valid: this._hasSpecialChar(pwd), message: 'At least one special character.' },
      { valid: this._hasMinLength(pwd), message: 'At least 8 characters long.' },
    ];
  }
*/
  private _hasUppercase(password: string): boolean {
    return /[A-Z]/.test(password);
  }

  private _hasLowercase(password: string): boolean {
    return /[a-z]/.test(password);
  }

  private _hasDigit(password: string): boolean {
    return /[0-9]/.test(password);
  }

  private _hasSpecialChar(password: string): boolean {
    return /[!@#$%^&*]/.test(password);
  }

  private _hasMinLength(password: string): boolean {
    return password.length >= 8;
  }
}
