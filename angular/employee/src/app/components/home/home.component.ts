import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { messageLife } from '../../shared/constants.model';
import { HomeFacadeService } from '../../services/home.facade.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  life = messageLife;

  homeFacade: HomeFacadeService = inject(HomeFacadeService);

  ngOnInit(): void {
    this.homeFacade.getRoles();
    this.homeFacade.getPanelData();
  }
}
