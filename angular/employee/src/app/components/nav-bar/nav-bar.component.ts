import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth/auth.service';
import { fireToast } from '../../shared/utils';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {
  items: MenuItem[] = [];

  constructor(private authService: AuthService, private messageService: MessageService) { }

  ngOnInit(): void {
    const navBarString = localStorage.getItem("navBarState");
    this.authService.menuItemsSubject.subscribe({
      next: (value: MenuItem[]) => {
        this.items = value;
      },
      error: (err: any) => { fireToast('error', 'Error', err.error.message, this.messageService); },
      complete: () => { }
    });
  }
}
