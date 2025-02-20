import { NgModule } from '@angular/core';
import { RoleRoutingModule } from './role-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RoleEditComponent } from '../../components/role/role-edit/role-edit.component';
import { RoleListComponent } from '../../components/role/role-list/role-list.component';
import { RoleComponent } from '../../components/role/role.component';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ConfirmDialog } from 'primeng/confirmdialog';

@NgModule({
    imports: [
        SharedModule,
        RoleRoutingModule,
        FormsModule,
        AccordionModule,
        ButtonModule,
        TooltipModule,
        TableModule,
        PaginatorModule,
        InputTextModule,
        DynamicDialogModule,
        ConfirmDialog,
        RoleComponent,
        RoleListComponent,
        RoleEditComponent
    ]
})
export class RoleModule { }
