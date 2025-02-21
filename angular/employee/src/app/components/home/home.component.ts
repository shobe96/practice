import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { messageLife } from '../../shared/constants.model';
import { HomeFacadeService } from '../../services/home.facade.service';
import { NgIf, AsyncPipe } from '@angular/common';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { Tooltip } from 'primeng/tooltip';
import { HomePanelComponent } from './home-panel/home-panel.component';
import { Toast } from 'primeng/toast';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf, Button, RouterLink, Tooltip, HomePanelComponent, Toast, AsyncPipe]
})
export class HomeComponent implements OnInit {

  life = messageLife;

  homeFacade: HomeFacadeService = inject(HomeFacadeService);

  ngOnInit(): void {
    this.homeFacade.getRoles();
    this.homeFacade.getPanelData();
  }
}
