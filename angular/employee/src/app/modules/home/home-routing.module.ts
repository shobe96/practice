import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../../components/home/home.component';
import { HomePanelComponent } from '../../components/home/home-panel/home-panel.component';
import { authGuard } from '../../shared/guards/auth.guard';
import { ADMIN, DEPARTMENT_CHIEF, EMPLOYEE } from '../../shared/authotities-constants';

const routes: Routes = [
  {
    path: "", component: HomeComponent, children: [
      { path: "panel", component: HomePanelComponent, canActivate: [authGuard], data: { roles: [ADMIN, EMPLOYEE, DEPARTMENT_CHIEF] } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
