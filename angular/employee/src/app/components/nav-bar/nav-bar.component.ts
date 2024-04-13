import { Component, OnInit } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {
  items: MenuItem[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.items = [
      {
        label: 'Home',
        icon: PrimeIcons.HOME,
        routerLink: "/"
      },
      {
        label: 'Features',
        icon: PrimeIcons.LIST,
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
          }
        ]
      },
      {
        label: 'User',
        icon: PrimeIcons.USER,
        items: [
          {
            label: 'Login',
            icon: PrimeIcons.SIGN_IN,
            routerLink: '/auth/login'
          },
          {
            label: 'Register',
            icon: PrimeIcons.USER_PLUS
          },
          {
            label: 'Logout',
            icon: PrimeIcons.SIGN_OUT,
            command: () => {
              this.logout();
            }
          }
        ]
      }
    ];
  }

  private logout() {
    this.authService.logout();
  }
}
