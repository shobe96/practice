import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { SharedModule } from './modules/shared/shared.module';
import { AuthFormComponent } from './components/auth/auth-form/auth-form.component';
import { authInterceptor } from './shared/interceptors/auth/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    AuthFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [provideHttpClient(withInterceptors([authInterceptor]))],
  bootstrap: [AppComponent]
})
export class AppModule { }
