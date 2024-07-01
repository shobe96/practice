import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleComponent } from '../../components/role/role.component';
import { RoleListComponent } from '../../components/role/role-list/role-list.component';
import { RoleEditComponent } from '../../components/role/role-edit/role-edit.component';
import { RoleDetailsComponent } from '../../components/role/role-details/role-details.component';
import { roleResolver } from '../../resolvers/role/role.resolver';

const routes: Routes = [
  {
    path: "", component: RoleComponent, children: [
      { path: "list", component: RoleListComponent },
      { path: "new", component: RoleEditComponent },
      { path: "edit/:roleId", component: RoleEditComponent },
      { path: "details/:roleId", component: RoleDetailsComponent, resolve: {role: roleResolver} }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
