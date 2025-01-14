import { Component, inject, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth/auth.service';
import { fireToast } from '../../shared/utils';
import { AuthResponse } from '../../models/auth-response.model';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  standalone: false
})
export class NavBarComponent implements OnInit {
  items: MenuItem[] = [];

  private authService: AuthService = inject(AuthService);
  private messageService: MessageService = inject(MessageService);

  ngOnInit(): void {
    const authResponse = localStorage.getItem("authResponse");
    if (authResponse) {
      const json: AuthResponse = JSON.parse(authResponse);
      this.authService.updateMenuItems(true, json.roles);
      this.items = this.authService.menuItemsSubject.value
    } else {
      this.authService.menuItemsSubject.subscribe({
        next: (value: MenuItem[]) => {
          this.items = value;
        },
        error: (err: any) => { fireToast('error', 'Error', err.error.message, this.messageService); },
        complete: () => { }
      });
    }
  }
}
