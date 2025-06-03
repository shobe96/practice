import { inject, Injectable } from '@angular/core';
import { EmployeeService } from '../../employees/data-access/employee.service';
import { BehaviorSubject, catchError, combineLatest, finalize, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Employee } from '../../employees/data-access/employee.model';
import { EmployeeSearchResult } from '../../employees/data-access/employee-search-result.model';
import { RoleService } from '../../roles/data-access/role.service';
import { Role } from '../../roles/data-access/role.model';
import { RoleSearchResult } from '../../roles/data-access/role-search-result.model';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { AuthResponse } from './auth-response.model';
import { AuthRequest } from './auth-request.model';
import { enumRoles } from '../../shared/constants.model';
import { CustomMessageService } from '../../shared/data-access/custom-message.service';
import { AuthState } from './auth-state';

@Injectable({
  providedIn: 'root'
})
export class AuthFacadeService {

  private _router: Router = inject(Router);
  private _authService: AuthService = inject(AuthService);
  private _roleService: RoleService = inject(RoleService);
  private _employeeService: EmployeeService = inject(EmployeeService);
  private _customMessageService: CustomMessageService = inject(CustomMessageService);

  private _employees$: BehaviorSubject<Employee[]> = new BehaviorSubject<Employee[]>([]);
  private _roles$: BehaviorSubject<Role[]> = new BehaviorSubject<Role[]>([]);
  private _loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _menuItems$: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this._buildMenuItems());
  private _tokenExpirationTimer: NodeJS.Timeout | undefined;

  viewModel$: Observable<AuthState> = combineLatest({
    employees: this._employees$.asObservable(),
    roles: this._roles$.asObservable(),
    menuItems: this._menuItems$.asObservable(),
    loading: this._loading$.asObservable()
  });

  loadSelectOptions(): void {
    this._getEmployees();
    this._getRoles();
  }

  checkAuthResponse(): void {
    const authResponse = localStorage.getItem("authResponse");
    if (authResponse) {
      const json: AuthResponse = JSON.parse(authResponse);
      this._updateMenuItems(true, json.roles);
    }
  }

  loginUser(authRequest: AuthRequest): void {
    this._loading$.next(true);
    const loginObserver = {
      next: (value: AuthResponse) => {
        localStorage.setItem('authResponse', JSON.stringify(value));
        this._autoLogout(value.expiration ?? 0);
        this._updateMenuItems(true, value.roles);
        this._customMessageService.showSuccess('Success', `Welcome ${value.username}`);
        this._router.navigate(["/home"]);
      }
    };
    this._authService.login(authRequest).pipe(finalize(() => this._loading$.next(false)), catchError((err) => {
      {
        this._customMessageService.showError('Error', err.error.message);
        throw err;
      }
    })).subscribe(loginObserver);
  }

  registerUser(authRequest: AuthRequest): void {
    this._loading$.next(true);
    const registerObserver = {
      next: () => {
        this._customMessageService.showSuccess('Success', 'User registered');
        this._router.navigate(["user/list"]);
      }
    }
    this._authService.registerUser(authRequest).pipe(
      finalize(() => this._loading$.next(false)),
      catchError((err) => {
        this._customMessageService.showError('Error', err.error.message);
        throw err;
      })).subscribe(registerObserver);
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

  private _getEmployees(): void {
    const employeesObserver = {
      next: (value: EmployeeSearchResult) => {
        if (value.employees) {
          this._employees$.next(value.employees);
        }
      },
      error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); }
    }
    this._employeeService.getAllEmployees(true)
      .subscribe(employeesObserver);
  }

  private _getRoles(): void {
    const rolesObserver = {
      next: (value: RoleSearchResult) => {
        if (value.roles) {
          this._roles$.next(value.roles);
        }
      },
      error: (errorMessage: string) => { this._customMessageService.showError('Error', errorMessage); },
    }
    this._roleService.getAllRoles(true).subscribe(rolesObserver);
  }

  private _updateMenuItems(isLoggedIn: boolean, roles: Role[] = []): void {
    const items = this._buildMenuItems();

    const isAdmin = roles.some(role => role.code === enumRoles.ADMIN);

    items[1].visible = isAdmin;
    const userItems = items[2].items ?? [];

    userItems[0].visible = isAdmin;
    userItems[1].visible = isAdmin;
    userItems[2].visible = !isLoggedIn;
    userItems[3].visible = isAdmin;
    userItems[4].visible = isLoggedIn;

    this._menuItems$.next(items);
  }

  private _buildMenuItems(): MenuItem[] {
    return [
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
  }
}
