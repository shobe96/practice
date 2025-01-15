import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AuthRequest } from '../../models/auth-request.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthResponse } from '../../models/auth-response.model';
import { Router } from '@angular/router';
import { RegisterRequest } from '../../models/register-request.model';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { ADMIN } from '../../shared/authotities-constants';
import { Role } from '../../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private backendURL = environment.BACKEND_URL;
  private baseUrl = "/api/auth";
  private tokenExpirationTimer: any;
  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router)

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

  public menuItemsSubject$: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);

  public login(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post(`${this.backendURL}${this.baseUrl}/login`, request);
  }

  public logout(): void {
    localStorage.removeItem("authResponse");
    clearTimeout(this.tokenExpirationTimer);
    this.updateMenuItems(false);
    this.router.navigate(['/auth/login']);
  }

  public autoLogout(expiration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expiration);
  }

  public registerUser(request: RegisterRequest): Observable<string> {
    return this.http.post<string>(`${this.backendURL}${this.baseUrl}/register-user`, request);
  }

  public updateMenuItems(isloggedIn: boolean, roles?: Role[]): void {
    roles = roles ?? [];
    if (roles.length > 0) {
      for (const role of roles) {
        if (role.code === ADMIN) {
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
    localStorage.setItem('navBarState', JSON.stringify(this.items));
    this.menuItemsSubject$.next(this.items);
  }

  public delete(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.backendURL}${this.baseUrl}/delete/${userId}`);
  }
}
