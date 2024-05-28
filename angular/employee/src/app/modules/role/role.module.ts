import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleRoutingModule } from './role-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RoleDetailsComponent } from '../../components/role/role-details/role-details.component';
import { RoleEditComponent } from '../../components/role/role-edit/role-edit.component';
import { RoleListComponent } from '../../components/role/role-list/role-list.component';
import { RoleComponent } from '../../components/role/role.component';


@NgModule({
  declarations: [
    RoleComponent,
    RoleListComponent,
    RoleEditComponent,
    RoleDetailsComponent
  ],
  imports: [
    SharedModule,
    RoleRoutingModule
  ]
})
export class RoleModule { }
