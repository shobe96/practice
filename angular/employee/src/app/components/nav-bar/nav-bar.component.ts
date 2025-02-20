import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AuthFacadeService } from '../../services/auth/auth.facade.service';
import { messageLife } from '../../shared/constants.model';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavBarComponent implements OnInit {

  life = messageLife;

  authFacade: AuthFacadeService = inject(AuthFacadeService);

  ngOnInit(): void {
    this.authFacade.checkAuthResponse();
  }
}
