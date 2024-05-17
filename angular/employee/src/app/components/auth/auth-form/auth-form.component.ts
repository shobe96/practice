import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthRequest } from '../../../models/auth-request.model';
import { AuthService } from '../../../services/auth/auth.service';
import { Subject, Subscription } from 'rxjs';
import { AuthResponse } from '../../../models/auth-response.model';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { StrongPasswordRegx } from '../../../shared/constants.model';
import { MessageService, PrimeIcons } from 'primeng/api';
import { Router } from '@angular/router';
import { RoleService } from '../../../services/role/role.service';
import { Role } from '../../../models/role.model';
import { RoleSearchResult } from '../../../models/role-search-result.model';
import { RegisterRequest } from '../../../models/register-request.model';
import { Employee } from '../../../models/employee.model';
import { EmployeeService } from '../../../services/employee/employee.service';
import { EmployeeSearchResult } from '../../../models/employee-search-result.model';
import { fireToast } from '../../../shared/utils';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss'
})
export class AuthFormComponent implements OnInit, OnDestroy {
  showConfirmPassword: any;
  authRequest: AuthRequest = new AuthRequest();
  authFormGroup!: FormGroup;
  private authSubsription$!: Subscription;
  showPassword: boolean = false;
  icon: string = PrimeIcons.EYE;
  severity: string = "success";
  tooltipMessage: string = "Show Password";
  isLoggin: boolean = false;
  tooltipConfirmMessage: string = "Show Confirm Password";
  confirmIcon: string = PrimeIcons.EYE;
  confirmSeverity: string = "success";
  private usernameSubject = new Subject<string>();
  roles: Role[] = [];
  employees: Employee[] = [];

  @ViewChild('menubar') menuBar: any;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private roleService: RoleService,
    private messageService: MessageService,
    private employeeService: EmployeeService) { }

  ngOnInit(): void {

    this.isLoggin = this.router.url.includes("login");
    if (!this.isLoggin) {
      this.employeeService.getAllEmployees(true).subscribe({
        next: (value: EmployeeSearchResult) => {
          this.employees = value.employees ?? [];
        },
        error: (err: any) => {
          fireToast('error', `${err.statusText}`, 'Failed to retrieve employees.', this.messageService);
        },
        complete: () => {

        },
      });
      this.roleService.getAllRoles(true).subscribe({
        next: (value: RoleSearchResult) => {
          this.roles = value.roles ?? [];
        },
        error: (err: any) => {
          if (err.status === 0) {
            fireToast('error', `${err.statusText}`, `Something went wrong. Conatact admin.`, this.messageService);
          } else {
            fireToast('error', 'Error', `${err.message}`, this.messageService);
          }
        },
        complete: () => { }
      })
    }

    this.buildForm();
  }


  ngOnDestroy(): void {
    if (this.authSubsription$ !== undefined) {
      this.authSubsription$.unsubscribe();
    }
    this.usernameSubject.complete();
  }

  public submit() {
    if (this.isLoggin) {
      this.authRequest.username = this.authFormGroup.controls['username'].value;
      this.authRequest.password = this.authFormGroup.controls['password'].value;
      this.authSubsription$ = this.authService.login(this.authRequest).subscribe({
        next: (value: AuthResponse) => {
          localStorage.setItem('authResponse', JSON.stringify(value));
          this.authService.autoLogout(value.expiration ?? 0);
          this.authService.updateMenuItems(true, value.roles);
          this.router.navigate(["/"]);
          fireToast('success', 'Success', `Welcome: ${value.username}`, this.messageService);

        },
        error: (err: any) => { fireToast('error', 'Error', err.error.message, this.messageService); },
        complete: () => { }
      });
    } else {
      let registerRequest: RegisterRequest = new RegisterRequest();
      registerRequest.username = this.authFormGroup.controls['username'].value;
      registerRequest.password = this.authFormGroup.controls['password'].value;
      registerRequest.roles = this.authFormGroup.controls['selectedRoles'].value;
      registerRequest.employee = this.authFormGroup.controls['employee'].value;
      this.authService.registerUser(registerRequest).subscribe({
        next: (value: string) => {
          fireToast('success', 'Success', 'Registered successfully', this.messageService);
          this.router.navigate(["user/list"]);
        },
        error: (err: any) => { console.log(err); fireToast('error', 'Error', err.error.message, this.messageService); },
        complete: () => { console.log("Complete") }
      });
    }

  }

  private buildForm() {
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
        selectedRoles: new FormControl([]),
        employee: new FormControl({})
      }, { validators: [this.passwordMissmatchTest()] });
    }

  }

  public togglePasswordVisibility() {
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

  public toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
    if (this.showConfirmPassword) {
      this.confirmIcon = PrimeIcons.EYE_SLASH;
      this.confirmSeverity = "danger";
      this.tooltipConfirmMessage = "Hide Confirm Password";
    } else {
      this.confirmIcon = PrimeIcons.EYE;
      this.confirmSeverity = "success";
      this.tooltipConfirmMessage = "Show Confirm Password";

    }
  }

  public toggleIcon() {
    return this.showPassword ? PrimeIcons.EYE_SLASH : PrimeIcons.EYE;
  }

  passwordMissmatchTest(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value.password;
      const confirmPassword = control.value.confirmPassword;
      console.log(password);
      console.log(confirmPassword);
      return password === confirmPassword ? null : { passwordMissmatch: true }
    }

  }
}
