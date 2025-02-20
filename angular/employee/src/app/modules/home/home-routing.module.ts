import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../../components/home/home.component';
import { HomePanelComponent } from '../../components/home/home-panel/home-panel.component';
import { authGuard } from '../../shared/guards/auth.guard';
import { enumRoles } from '../../shared/constants.model';

const routes: Routes = [
  {
    path: "", component: HomeComponent, children: [
      { path: "panel", component: HomePanelComponent, canActivate: [authGuard], data: { roles: [enumRoles.ADMIN, enumRoles.EMPLOYEE, enumRoles.DEPARTMENT_CHIEF] } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
