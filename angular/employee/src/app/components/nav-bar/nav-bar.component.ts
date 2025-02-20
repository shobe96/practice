import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AuthFacadeService } from '../../services/auth/auth.facade.service';
import { messageLife } from '../../shared/constants.model';
import { NgIf, AsyncPipe } from '@angular/common';
import { Menubar } from 'primeng/menubar';
import { PrimeTemplate } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrl: './nav-bar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf, Menubar, PrimeTemplate, Toast, AsyncPipe]
})
export class NavBarComponent implements OnInit {

  life = messageLife;

  authFacade: AuthFacadeService = inject(AuthFacadeService);

  ngOnInit(): void {
    this.authFacade.checkAuthResponse();
  }
}
