import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthRequest } from '../../../models/auth-request.model';
import { AuthService } from '../../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { AuthResponse } from '../../../models/auth-response.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StrongPasswordRegx } from '../../../shared/constants.model';
import { PrimeIcons } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss'
})
export class AuthFormComponent implements OnInit, OnDestroy {

  authRequest: AuthRequest = new AuthRequest();
  authFormGroup!: FormGroup;
  private authSubsription$!: Subscription;
  showPassword: boolean = false;
  icon: string = PrimeIcons.EYE;
  severity: string = "success";
  tooltipMessage: string = "Show Password";
  private tokenExpirationTimer: any;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.buildForm();
  }


  ngOnDestroy(): void {
    if (this.authSubsription$ !== undefined)
      this.authSubsription$.unsubscribe();
  }

  public login() {
    this.authRequest.username = this.authFormGroup.controls['username'].value;
    this.authRequest.password = this.authFormGroup.controls['password'].value;
    this.authService.login(this.authRequest).subscribe({
      next: (value: AuthResponse) => {
        localStorage.setItem('authResponse', JSON.stringify(value));
        this.authService.autoLogout(value.expiration ?? 0);

      },
      error: (err: any) => { console.log(err) },
      complete: () => { }
    })
  }

  public buildForm() {
    this.authFormGroup = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern(StrongPasswordRegx)]]
    });
  }

  public togglePasswordVisibility() {
    console.log("Toggle method")
    this.showPassword = !this.showPassword;
    if (this.showPassword) {
      this.icon = PrimeIcons.EYE_SLASH;
      this.severity = "danger";
      this.tooltipMessage = "Hide Password";
    } else {
      this.icon = PrimeIcons.EYE;
      this.severity = "success";
      this.tooltipMessage = "Show Password";

    }
  }

  public toggleIcon() {
    return this.showPassword ? PrimeIcons.EYE_SLASH : PrimeIcons.EYE;
  }

  autoLogout(expiration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expiration);
  }

  logout() {
    localStorage.removeItem("authResponse");
    this.router.navigate(['/auth/login']);
    clearTimeout(this.tokenExpirationTimer);
  }
}
