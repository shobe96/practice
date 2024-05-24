import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../../components/home/home.component';
import { HomeAdminComponent } from '../../components/home/home-admin/home-admin.component';

const routes: Routes = [
  {
    path: "", component: HomeComponent, children: [
      { path: "adm", component: HomeAdminComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
