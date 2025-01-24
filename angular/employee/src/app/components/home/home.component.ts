import { Component, inject, OnInit } from '@angular/core';
import { AuthResponse } from '../../models/auth-response.model';
import { Role } from '../../models/role.model';

import { messageLife } from '../../shared/constants.model';
import { HomeFacadeService } from '../../services/home.facade.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: false
})
export class HomeComponent implements OnInit {

  homeFacade: HomeFacadeService = inject(HomeFacadeService);
  life = messageLife;

  ngOnInit(): void {
    this.homeFacade.getRoles();
  }
}
