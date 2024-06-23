import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from '../../components/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { HomePanelComponent } from '../../components/home/home-panel/home-panel.component';


@NgModule({
  declarations: [
    HomeComponent,
    HomePanelComponent,
  ],
  imports: [
    SharedModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
