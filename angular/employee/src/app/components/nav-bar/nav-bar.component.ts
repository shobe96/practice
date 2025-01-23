import { Component, inject, OnInit } from '@angular/core';
import { AuthFacadeService } from '../../services/auth/auth.facade.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  standalone: false
})
export class NavBarComponent implements OnInit {

  authFacade: AuthFacadeService = inject(AuthFacadeService);

  ngOnInit(): void {
    this.authFacade.checkAuthResponse();
  }
}
