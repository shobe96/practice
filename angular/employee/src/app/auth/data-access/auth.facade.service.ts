import { inject, Injectable } from '@angular/core';
import { EmployeeService } from '../../employees/data-access/employee.service';
import { BehaviorSubject, catchError, combineLatest, finalize, Observable, of, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Employee } from '../../employees/data-access/employee.model';
import { RoleService } from '../../roles/data-access/role.service';
import { Role } from '../../roles/data-access/role.model';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { AuthResponse } from './auth-response.model';
import { AuthRequest } from './auth-request.model';
import { enumRoles } from '../../shared/constants.model';
import { CustomMessageService } from '../../shared/data-access/services/custom-message/custom-message.service';
import { SearchResult } from '../../shared/data-access/search-result.model';
import { EmployeeSearchCriteria } from '../../employees/data-access/employee-search.criteria';

@Injectable({
  providedIn: 'root'
})
export class AuthFacadeService {

  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);
  private readonly _roleService = inject(RoleService);
  private readonly _employeeService = inject(EmployeeService);
  private readonly _customMessageService = inject(CustomMessageService);

  private readonly _employees$ = new BehaviorSubject<Employee[]>([]);
  private readonly _roles$ = new BehaviorSubject<Role[]>([]);
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  private readonly _menuItems$ = new BehaviorSubject<MenuItem[]>(this._buildMenuItems());

  private _tokenExpirationTimer?: ReturnType<typeof setTimeout>;

  viewModel$ = combineLatest({
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
    const stored = localStorage.getItem('authResponse');
    if (!stored) return;

    const authResponse: AuthResponse = JSON.parse(stored);
    this._updateMenuItems(true, authResponse.roles);
  }

  loginUser(authRequest: AuthRequest): void {
    this._loading$.next(true);
    this._authService.login(authRequest).pipe(
      tap((response: AuthResponse) => {
        localStorage.setItem('authResponse', JSON.stringify(response));
        this._autoLogout(response.expiration ?? 0);
        this._updateMenuItems(true, response.roles);
        this._customMessageService.showSuccess('Success', `Welcome ${response.username}`);
        this._router.navigate(["/home/panel"]);
      }),
      catchError((err) => {
        this._customMessageService.showError('Error', err.error.message);
        return of()
      }),
      finalize(() => this._loading$.next(false))
    ).subscribe();
  }

  registerUser(authRequest: AuthRequest): void {
    this._loading$.next(true);
    this._authService.registerUser(authRequest).pipe(
      tap(() => {
        this._customMessageService.showSuccess('Success', 'User registered');
        this._router.navigate(["user/list"]);
      }),
      catchError((err) => {
        this._customMessageService.showError('Error', err.error.message);
        return of()
      }),
      finalize(() => this._loading$.next(false))
    ).subscribe();
  }

  deleteUser(userId: number) {
    this._withLoading(() => this._authService.delete(userId).pipe(this._handleError('Error', null)));
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
    const criteria: EmployeeSearchCriteria = {
      withoutUser: true
    };
    this._employeeService.search(criteria)
      .pipe(tap((res: SearchResult<Employee>) => {
        this._employees$.next(res.items ?? []);
      }),
        catchError((err) => {
          this._customMessageService.showError('Error', err.error.message);
          return of()
        })
      )
      .subscribe();
  }

  private _getRoles(): void {
    this._roleService.getAll()
      .pipe(tap((res: Role[]) => {
        this._roles$.next(res ?? []);
      }),
        catchError((err) => {
          this._customMessageService.showError('Error', err.error.message);
          return of()
        })
      )
      .subscribe();
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

  private _withLoading<T>(fn: () => Observable<T>): void {
    this._loading$.next(true);
    fn().pipe(finalize(() => this._loading$.next(false))).subscribe();
  }

  private _handleError<T>(severity: 'Error' | 'Warning', fallback: T) {
    return catchError((err) => {
      const msg = err?.error?.message ?? 'Unknown error';
      if (severity === 'Error')
        this._customMessageService.showError(severity, msg)
      else this._customMessageService.showWarn(severity, msg);
      return of(fallback);
    });
  }
}
