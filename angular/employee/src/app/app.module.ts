import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { SharedModule } from './modules/shared/shared.module';
import { AuthFormComponent } from './components/auth/auth-form/auth-form.component';
import { authInterceptor } from './shared/interceptors/auth/auth.interceptor';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura'

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    AuthFormComponent
  ],
  bootstrap: [AppComponent],
  imports: [BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideHttpClient(withInterceptorsFromDi()),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
  ]
})
export class AppModule { }
