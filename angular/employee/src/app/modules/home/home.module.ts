import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from '../../components/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { HomeAdminComponent } from '../../components/home/home-admin/home-admin.component';


@NgModule({
  declarations: [
    HomeComponent,
    HomeAdminComponent
  ],
  imports: [
    SharedModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
