import { inject, Injectable } from '@angular/core';
import { EmployeeService } from '../employee/employee.service';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Employee } from '../../models/employee.model';
import { EmployeeSearchResult } from '../../models/employee-search-result.model';
import { RoleService } from '../role/role.service';
import { Role } from '../../models/role.model';
import { RoleSearchResult } from '../../models/role-search-result.model';
import { MenuItem, MessageService, PrimeIcons } from 'primeng/api';
import { AuthResponse } from '../../models/auth-response.model';
import { AuthRequest } from '../../models/auth-request.model';
import { fireToast } from '../../shared/utils';
import { enumRoles, enumSeverity } from '../../shared/constants.model';

@Injectable({
  providedIn: 'root'
})
export class AuthFacadeService {

  private _router: Router = inject(Router);
  private _authService: AuthService = inject(AuthService);
  private _roleService: RoleService = inject(RoleService);
  private _employeeService: EmployeeService = inject(EmployeeService);
  private _messageService: MessageService = inject(MessageService);

  private _employees: BehaviorSubject<Employee[]> = new BehaviorSubject<Employee[]>([]);
  private _isLoggin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _roles: BehaviorSubject<Role[]> = new BehaviorSubject<Role[]>([]);
  private _tokenExpirationTimer: any;

  private items: MenuItem[] = [
    {
      label: 'Home',
      icon: PrimeIcons.HOME,
      routerLink: "/home/panel",
    },
    {
      label: 'Features',
      icon: PrimeIcons.LIST,
      visible: false,
      items: [
        {
          label: 'Employees',
          icon: PrimeIcons.USERS,
          routerLink: '/employee/list'
        },
        {
          label: 'Departments',
          icon: PrimeIcons.SITEMAP,
          routerLink: '/department/list'
        },
        {
          label: 'Skills',
          icon: PrimeIcons.ANDROID,
          routerLink: '/skill/list'
        },
        {
          label: 'Projects',
          icon: PrimeIcons.CODE,
          routerLink: '/project/list'
        },
      ]
    },
    {
      label: 'User',
      icon: PrimeIcons.USER,
      items: [
        {
          label: 'Users',
          icon: PrimeIcons.USERS,
          routerLink: '/user/list',
          visible: false
        },
        {
          label: 'Roles',
          icon: PrimeIcons.WRENCH,
          routerLink: '/role/list',
          visible: false
        },
        {
          label: 'Login',
          icon: PrimeIcons.SIGN_IN,
          routerLink: '/auth/login'
        },
        {
          label: 'Register',
          icon: PrimeIcons.USER_PLUS,
          routerLink: '/auth/register',
          visible: false
        },
        {
          label: 'Logout',
          icon: PrimeIcons.SIGN_OUT,
          visible: false,
          command: () => {
            this.logout();
          }
        }
      ]
    }
  ];

  private _menuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);

  viewModel$: Observable<any> = combineLatest({
    employees: this._employees.asObservable(),
    roles: this._roles.asObservable(),
    isLoggin: this._isLoggin.asObservable(),
    menuItems: this._menuItems.asObservable()
  });

  loadSelectOptions(isLoggin: boolean) {
    this._isLoggin.next(isLoggin);
    if (!isLoggin) {
      this._getEmployees();
      this._getRoles();
    }
  }

  checkAuthResponse() {
    const authResponse = localStorage.getItem("authResponse");
    if (authResponse) {
      const json: AuthResponse = JSON.parse(authResponse);
      this._updateMenuItems(true, json.roles);
    }
  }

  loginUser(authRequest: AuthRequest) {
    this._authService.login(authRequest).subscribe((value: AuthResponse) => {
      localStorage.setItem('authResponse', JSON.stringify(value));
      this._autoLogout(value.expiration ?? 0);
      this._updateMenuItems(true, value.roles);
      fireToast(enumSeverity.success, 'Success', `Welcome ${value.username}`, this._messageService);
      this._router.navigate(["/home"]);
    });
  }

  registerUser(authRequest: AuthRequest) {
    this._authService.registerUser(authRequest).subscribe(() => {
      fireToast(enumSeverity.success, 'Success', 'User registered', this._messageService);
      this._router.navigate(["user/list"]);
    });
  }

  logout(): void {
    localStorage.removeItem("authResponse");
    clearTimeout(this._tokenExpirationTimer);
    this._updateMenuItems(false);
    this._router.navigate(['/auth/login']);
  }

  private _autoLogout(expiration: number): void {
    this._tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expiration);
  }

  private _getEmployees() {
    this._employeeService.getAllEmployees(true)
      .subscribe((value: EmployeeSearchResult) => {
        if (value.employees) {
          this._employees.next(value.employees);
        }
      });
  }

  private _getRoles() {
    this._roleService.getAllRoles(true).subscribe((value: RoleSearchResult) => {
      if (value.roles) {
        this._roles.next(value.roles);
      }
    })
  }

  private _updateMenuItems(isloggedIn: boolean, roles?: Role[]): void {
    roles = roles ?? [];
    if (roles.length > 0) {
      for (const role of roles) {
        if (role.code === enumRoles.ADMIN) {
          this.items[1].visible = isloggedIn;
          this.items[2].items![0].visible = isloggedIn;
          this.items[2].items![1].visible = isloggedIn;
          this.items[2].items![3].visible = isloggedIn;
        }
      }
    } else {
      this.items[1].visible = isloggedIn;
      this.items[2].items![0].visible = isloggedIn;
      this.items[2].items![1].visible = isloggedIn;
      this.items[2].items![3].visible = isloggedIn;
    }

    this.items[2].items![2].visible = !isloggedIn;
    this.items[2].items![4].visible = isloggedIn;
    this._menuItems.next(this.items);
  }
}
