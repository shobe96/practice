import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UserComponent } from '../../components/user/user.component';
import { UserListComponent } from '../../components/user/user-list/user-list.component';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';


@NgModule({
  declarations: [
    UserComponent,
    UserListComponent
  ],
  imports: [
    UserRoutingModule,
    SharedModule,
    AccordionModule,
    ButtonModule,
    TooltipModule,
    TableModule,
    PaginatorModule,
    DialogModule,
    InputTextModule,
  ]
})
export class UserModule { }
