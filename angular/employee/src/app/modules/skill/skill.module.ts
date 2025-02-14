import { NgModule } from '@angular/core';
import { SkillRoutingModule } from './skill-routing.module';
import { SkillEditComponent } from '../../components/skill/skill-edit/skill-edit.component';
import { SkillListComponent } from '../../components/skill/skill-list/skill-list.component';
import { SkillComponent } from '../../components/skill/skill.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [
    SkillComponent,
    SkillListComponent,
    SkillEditComponent
  ],
  imports: [
    SkillRoutingModule,
    SharedModule,
    FormsModule,
    AccordionModule,
    ButtonModule,
    TooltipModule,
    TableModule,
    PaginatorModule,
    InputTextModule,
    DynamicDialogModule,
    ConfirmDialogModule
  ]
})
export class SkillModule { }
