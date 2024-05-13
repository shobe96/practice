import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {
  items: MenuItem[] = [];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const navBarString = localStorage.getItem("navBarState");
    this.authService.menuItemsSubject.subscribe({
      next: (value: MenuItem[]) => {
        this.items = value;
      },
      error: (err: any) => { console.log(err) },
      complete: () => { }
    });
  }
}
