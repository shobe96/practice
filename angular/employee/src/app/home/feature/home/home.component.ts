import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { messageLife } from '../../../shared/constants.model';
import { HomeFacadeService } from '../../data-access/home.facade.service';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { Tooltip } from 'primeng/tooltip';
import { HomePanelComponent } from '../../ui/home-panel/home-panel.component';
import { Toast } from 'primeng/toast';
import { ProgressSpinner } from 'primeng/progressspinner';
import { toSignal } from '@angular/core/rxjs-interop';
import { PageEvent } from '../../../shared/data-access/page-event.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Button,
    RouterLink,
    Tooltip,
    HomePanelComponent,
    Toast,
    ProgressSpinner
  ]
})
export class HomeComponent implements OnInit {

  life = messageLife;

  private _homeFacade: HomeFacadeService = inject(HomeFacadeService);

  private _intialPage: PageEvent = {
    page: 0,
    first: 0,
    rows: 5,
    pageCount: 0,
    sort: 'asc',
  }
  viewModel = toSignal(this._homeFacade.viewModel$, {
    initialValue: {
      roles: [],
      page: this._intialPage,
      projectsHistory: [],
      employee: {},
      departmentEmployees:
        [],
      activeProject: {},
      loading: false
    }
  });

  ngOnInit(): void {
    this._homeFacade.getRoles();
    this._homeFacade.getPanelData();
  }
}
