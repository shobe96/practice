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
        message: this._translateService.instant('VALIDATIONS.PASSWORD.UPPER'),
      },
      {
        valid: this._hasLowercase(pwd),
        message: this._translateService.instant('VALIDATIONS.PASSWORD.LOWER'),
      },
      { valid: this._hasDigit(pwd), message: this._translateService.instant('VALIDATIONS.PASSWORD.DIGIT') },
      {
        valid: this._hasSpecialChar(pwd),
        message: this._translateService.instant('VALIDATIONS.PASSWORD.SPECIAL'),
      },
      {
        valid: this._hasMinLength(pwd),
        message: this._translateService.instant('VALIDATIONS.PASSWORD.LENGTH'),
      },
    ];
  });

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
