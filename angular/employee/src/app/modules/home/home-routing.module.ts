import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../../components/home/home.component';
import { HomePanelComponent } from '../../components/home/home-panel/home-panel.component';

const routes: Routes = [
  {
    path: "", component: HomeComponent, children: [
      { path: "panel", component: HomePanelComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
