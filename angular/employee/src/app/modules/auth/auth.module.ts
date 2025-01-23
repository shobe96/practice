import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AuthComponent } from '../../components/auth/auth.component';
import { AuthFormComponent } from '../../components/auth/auth-form/auth-form.component';


@NgModule({
  declarations: [
    AuthComponent,
    AuthFormComponent
  ],
  imports: [
    SharedModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
