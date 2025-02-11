import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkillComponent } from '../../components/skill/skill.component';
import { SkillListComponent } from '../../components/skill/skill-list/skill-list.component';

const routes: Routes = [
  {
    path: "", component: SkillComponent, children: [
      { path: "list", component: SkillListComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillRoutingModule { }
