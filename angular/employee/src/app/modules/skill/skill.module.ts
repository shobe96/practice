import { NgModule } from '@angular/core';
import { SkillRoutingModule } from './skill-routing.module';
import { SkillEditComponent } from '../../components/skill/skill-edit/skill-edit.component';
import { SkillListComponent } from '../../components/skill/skill-list/skill-list.component';
import { SkillComponent } from '../../components/skill/skill.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SkillComponent,
    SkillListComponent,
    SkillEditComponent
  ],
  imports: [
    SkillRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class SkillModule { }
