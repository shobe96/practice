import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkillComponent } from '../../components/skill/skill.component';
import { SkillListComponent } from '../../components/skill/skill-list/skill-list.component';
import { SkillEditComponent } from '../../components/skill/skill-edit/skill-edit.component';
import { SkillDetailsComponent } from '../../components/skill/skill-details/skill-details.component';
import { skillResolver } from '../../resolvers/skill/skill.resolver';

const routes: Routes = [
  {
    path: "", component: SkillComponent, children: [
      { path: "list", component: SkillListComponent },
      { path: "new", component: SkillEditComponent },
      { path: "edit/:skillId", component: SkillEditComponent },
      { path: "details/:skillId", component: SkillDetailsComponent, resolve: { skill: skillResolver } },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillRoutingModule { }
