import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AuthComponent } from '../../components/auth/auth.component';
import { AuthFormComponent } from '../../components/auth/auth-form/auth-form.component';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { RegisterComponent } from '../../components/auth/register/register.component';
import { LoginComponent } from '../../components/auth/login/login.component';


@NgModule({
  declarations: [
    AuthComponent,
    AuthFormComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    SharedModule,
    AuthRoutingModule,
    ButtonModule,
    TooltipModule,
    MultiSelectModule,
    ToastModule,
    SelectModule,
    InputTextModule,
  ]
})
export class AuthModule { }
