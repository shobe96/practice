import { inject, Injectable } from '@angular/core';
import { EmployeeService } from '../../employees/data-access/employee.service';
import { BehaviorSubject, catchError, combineLatest, finalize, map, Observable, of, startWith, tap } from 'rxjs';
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
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AuthFacadeService {

  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);
  private readonly _roleService = inject(RoleService);
  private readonly _employeeService = inject(EmployeeService);
  private readonly _customMessageService = inject(CustomMessageService);
  private readonly _translate = inject(TranslateService);

  private get _storedAuth() {
    const stored = localStorage.getItem('authResponse');
    return stored ? JSON.parse(stored) : null;
  }

  private readonly _employees$ = new BehaviorSubject<Employee[]>([]);
  private readonly _roles$ = new BehaviorSubject<Role[]>(this._storedAuth?.roles ?? []);
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  private readonly _isLoggedIn$ = new BehaviorSubject<boolean>(!!this._storedAuth);

  public readonly menuItems$ = combineLatest([
    this._translate.onLangChange.pipe(startWith(null)),
    this._isLoggedIn$,
    this._roles$
  ]).pipe(map(([, isLoggedIn, roles])=> this._getProcessedMenu(isLoggedIn, roles)
  ));

  private _tokenExpirationTimer?: ReturnType<typeof setTimeout>;

  viewModel$ = combineLatest({
    employees: this._employees$.asObservable(),
    roles: this._roles$.asObservable(),
    menuItems: this.menuItems$,
    loading: this._loading$.asObservable()
  });

  loadSelectOptions(): void {
    this._getEmployees();
    this._getRoles();
  }

  checkAuthResponse(): void {
    const auth = this._storedAuth;
    if (auth) {
      this._isLoggedIn$.next(true);
      this._roles$.next(auth.roles ?? []);
      // Re-initialize auto-logout timer if necessary
      this._autoLogout(auth.expiration ?? 0);
    }
  }

  loginUser(authRequest: AuthRequest): void {
    this._loading$.next(true);
    this._authService.login(authRequest).pipe(
      tap((response: AuthResponse) => {
        localStorage.setItem('authResponse', JSON.stringify(response));
        this._autoLogout(response.expiration ?? 0);
        this._isLoggedIn$.next(true);
        this._roles$.next(response.roles ?? []);
        const message = this._translate.instant("AUTH.LOGIN.WELCOME");
        const success = this._translate.instant("MODAL.SUCCESS");
        this._customMessageService.showSuccess(success, `${message} ${response.username}`);
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
    console.log("LOGOUT");
    localStorage.removeItem("authResponse");
    clearTimeout(this._tokenExpirationTimer);
    this._isLoggedIn$.next(false);
    this._roles$.next([]);
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

  private _buildMenuItems(): MenuItem[] {
    return [
      {
        label: this._translate.instant("NAVBAR.HOME"),
        icon: PrimeIcons.HOME,
        routerLink: "/home/panel",
      },
      {
        label: this._translate.instant("NAVBAR.FEATURES.TITLE"),
        icon: PrimeIcons.LIST,
        items: [
          {
            label: this._translate.instant("NAVBAR.FEATURES.EMPLOYEES"),
            icon: PrimeIcons.USERS,
            routerLink: '/employee/list'
          },
          {
            label: this._translate.instant("NAVBAR.FEATURES.DEPARTMENTS"),
            icon: PrimeIcons.SITEMAP,
            routerLink: '/department/list'
          },
          {
            label: this._translate.instant("NAVBAR.FEATURES.SKILLS"),
            icon: PrimeIcons.ANDROID,
            routerLink: '/skill/list'
          },
          {
            label: this._translate.instant("NAVBAR.FEATURES.PROJECTS"),
            icon: PrimeIcons.CODE,
            routerLink: '/project/list'
          },
        ]
      },
      {
        label: this._translate.instant("NAVBAR.USER.TITLE"),
        icon: PrimeIcons.USER,
        items: [
          {
            label: this._translate.instant("NAVBAR.USER.USERS"),
            icon: PrimeIcons.USERS,
            routerLink: '/user/list',
            visible: false
          },
          {
            label: this._translate.instant("NAVBAR.USER.ROLES"),
            icon: PrimeIcons.WRENCH,
            routerLink: '/role/list',
            visible: false
          },
          {
            label: this._translate.instant("NAVBAR.USER.LOGIN"),
            icon: PrimeIcons.SIGN_IN,
            routerLink: '/auth/login'
          },
          {
            label: this._translate.instant("NAVBAR.USER.REGISTER"),
            icon: PrimeIcons.USER_PLUS,
            routerLink: '/auth/register',
            visible: false
          },
          {
            label: this._translate.instant("NAVBAR.USER.LOGOUT"),
            icon: PrimeIcons.SIGN_OUT,
            command: () => {
              this.logout();
            }
          }
        ]
      },
      {
        label: this._translate.instant("NAVBAR.LANGUAGE.TITLE"),
        icon: PrimeIcons.LANGUAGE,
        items: [
          {
            label: this._translate.instant("NAVBAR.LANGUAGE.ENGLISH"),
            command: () => {
              this._changeLanguage('en');
            }
          },
          {
            label: this._translate.instant("NAVBAR.LANGUAGE.SERBIAN"),
            command: () => {
              this._changeLanguage('rs');
            }
          },
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

  private _changeLanguage(lang: string) {
    this._translate.use(lang);
  }

  private _getProcessedMenu(isLoggedIn: boolean, roles: Role[]): MenuItem[] {
    const items = this._buildMenuItems();
    const isAdmin = roles.some(role => role.code === enumRoles.ADMIN);

    items[1].visible = isAdmin; // Features
    const userItems = items[2].items ?? [];

    userItems[0].visible = isAdmin;     // Users
    userItems[1].visible = isAdmin;     // Roles
    userItems[2].visible = !isLoggedIn; // Login
    userItems[3].visible = isAdmin;     // Register
    userItems[4].visible = isLoggedIn;  // Logout
    return items;
  }
}
