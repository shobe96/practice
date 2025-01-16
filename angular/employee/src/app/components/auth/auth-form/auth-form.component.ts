import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { Severity } from '../../../shared/custom-types';

@Component({
    selector: 'app-auth-form',
    templateUrl: './auth-form.component.html',
    styleUrl: './auth-form.component.scss',
    standalone: false
})
export class AuthFormComponent implements OnInit, OnDestroy {
  showConfirmPassword: any;
  authRequest: AuthRequest = {};
  authFormGroup!: FormGroup;
  private authSubsription$!: Subscription;
  showPassword: boolean = false;
  icon: string = PrimeIcons.EYE;
  severity: Severity = "success";
  tooltipMessage: string = "Show Password";
  isLoggin: boolean = false;
  tooltipConfirmMessage: string = "Show Confirm Password";
  confirmIcon: string = PrimeIcons.EYE;
  confirmSeverity: Severity = "success";
  roles: Role[] = [];
  employees: Employee[] = [];

  @ViewChild('menubar') menuBar: any;

  private authService: AuthService = inject(AuthService);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private roleService: RoleService = inject(RoleService);
  private messageService: MessageService = inject(MessageService);
  private employeeService: EmployeeService = inject(EmployeeService);


  constructor() { }

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
          !err.status ? fireToast('error', `${err.statusText}`, `Something went wrong. Conatact admin.`, this.messageService) : fireToast('error', 'Error', `${err.message}`, this.messageService);
        },
        complete: () => { }
      })
    }

    this.buildForm();
  }


  ngOnDestroy(): void {
    if (this.authSubsription$) {
      this.authSubsription$.unsubscribe();
    }
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
    const registerRequest: RegisterRequest = {};
    registerRequest.username = this.authFormGroup.controls['username'].value;
    registerRequest.password = this.authFormGroup.controls['password'].value;
    registerRequest.roles = this.authFormGroup.controls['selectedRoles'].value;
    registerRequest.employee = this.authFormGroup.controls['employee'].value;
    this.authSubsription$ = this.authService.registerUser(registerRequest).subscribe({
      next: () => {
        fireToast('success', 'Success', 'Registered successfully', this.messageService);
        this.router.navigate(["user/list"]);
      },
      error: (err: any) => { fireToast('error', 'Error', err.error.message, this.messageService); },
      complete: () => { }
    });
  }
  private loginUser(): void {
    this.authRequest.username = this.authFormGroup.controls['username'].value;
    this.authRequest.password = this.authFormGroup.controls['password'].value;
    this.authSubsription$ = this.authService.login(this.authRequest).subscribe({
      next: (value: AuthResponse) => {
        localStorage.setItem('authResponse', JSON.stringify(value));
        this.authService.autoLogout(value.expiration ?? 0);
        this.authService.updateMenuItems(true, value.roles);
        this.router.navigate(["/home/panel"]);
        fireToast('success', 'Success', `Welcome: ${value.username}`, this.messageService);
      },
      error: (err: any) => { fireToast('error', 'Error', err.error.message, this.messageService); },
      complete: () => { }
    });
  }
}
