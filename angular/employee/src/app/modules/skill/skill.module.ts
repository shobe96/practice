import { NgModule } from '@angular/core';
import { SkillRoutingModule } from './skill-routing.module';
import { SkillDetailsComponent } from '../../components/skill/skill-details/skill-details.component';
import { SkillEditComponent } from '../../components/skill/skill-edit/skill-edit.component';
import { SkillListComponent } from '../../components/skill/skill-list/skill-list.component';
import { SkillComponent } from '../../components/skill/skill.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    SkillComponent,
    SkillListComponent,
    SkillEditComponent,
    SkillDetailsComponent
  ],
  imports: [
    SkillRoutingModule,
    SharedModule
  ]
})
export class SkillModule { }
