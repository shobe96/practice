import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth/auth.service';
import { fireToast } from '../../shared/utils';
import { AuthResponse } from '../../models/auth-response.model';
import { Observable } from 'rxjs';
import { SubscriptionCleaner } from '../../shared/subscription-cleaner ';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  standalone: false
})
export class NavBarComponent extends SubscriptionCleaner implements OnInit, OnDestroy {

  public items: MenuItem[] = [];

  private authService: AuthService = inject(AuthService);
  private messageService: MessageService = inject(MessageService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.authService.getMenuItems().subscribe({
      next: (value: MenuItem[]) => {
        this.items = value;
      },
      error: (err: any) => { fireToast('error', 'Error', err.error.message, this.messageService); },
      complete: () => { }
    });
    this.checkAuthResponse();
  }

  ngOnDestroy(): void {
    this.unsubsribe();
  }

  private checkAuthResponse() {
    const authResponse = localStorage.getItem("authResponse");
    if (authResponse) {
      const json: AuthResponse = JSON.parse(authResponse);
      this.authService.updateMenuItems(true, json.roles);
    }
  }
}
