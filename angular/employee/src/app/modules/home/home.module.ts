import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from '../../components/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { HomePanelComponent } from '../../components/home/home-panel/home-panel.component';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';


@NgModule({
    imports: [
        SharedModule,
        HomeRoutingModule,
        TabsModule,
        TableModule,
        PaginatorModule,
        ButtonModule,
        TooltipModule,
        ToastModule,
        HomeComponent,
        HomePanelComponent
    ]
})
export class HomeModule { }
