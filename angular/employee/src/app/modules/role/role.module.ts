import { NgModule } from '@angular/core';
import { RoleRoutingModule } from './role-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RoleEditComponent } from '../../components/role/role-edit/role-edit.component';
import { RoleListComponent } from '../../components/role/role-list/role-list.component';
import { RoleComponent } from '../../components/role/role.component';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';


@NgModule({
  declarations: [
    RoleComponent,
    RoleListComponent,
    RoleEditComponent
  ],
  imports: [
    SharedModule,
    RoleRoutingModule,
    FormsModule,
    AccordionModule,
    ButtonModule,
    TooltipModule,
    TableModule,
    PaginatorModule,
    DialogModule,
    InputTextModule,
  ]
})
export class RoleModule { }
