import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthFacadeService } from '../../../auth/data-access/auth.facade.service';
import { messageLife } from '../../constants.model';
import { Menubar } from 'primeng/menubar';
import { PrimeTemplate } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Menubar, PrimeTemplate, Toast]
})
export class NavBarComponent{

  life = messageLife;

  authFacade: AuthFacadeService = inject(AuthFacadeService);

  viewModel = toSignal(this.authFacade.viewModel$, {initialValue: {
    employees: [],
    roles: [],
    menuItems: [],
    loading: false
  }});
}
