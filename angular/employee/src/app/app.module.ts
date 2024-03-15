import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModuleModule } from './app-routing-module.module';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModuleModule,
    AppComponent
  ],
})
export class AppModule { }
