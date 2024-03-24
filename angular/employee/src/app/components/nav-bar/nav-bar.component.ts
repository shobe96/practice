import { Component, OnInit } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {
  items: MenuItem[] | undefined;

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
            icon: PrimeIcons.USER,
            routerLink: '/employee'
          },
          {
            label: 'Departments',
            icon: PrimeIcons.SITEMAP,
            routerLink: '/department'
          }
        ]
      }
    ];
  }

}
