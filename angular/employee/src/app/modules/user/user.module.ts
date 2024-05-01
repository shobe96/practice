import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UserComponent } from '../../components/user/user.component';
import { UserListComponent } from '../../components/user/user-list/user-list.component';


@NgModule({
  declarations: [
    UserComponent,
    UserListComponent
  ],
  imports: [
    UserRoutingModule,
    SharedModule
  ]
})
export class UserModule { }
