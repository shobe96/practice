import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { authInterceptor } from './app/shared/interceptors/auth/auth.interceptor';
import { providePrimeNG } from 'primeng/config';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app/app-routing.module';
import { SharedModule } from './app/modules/shared/shared.module';
import { ToastModule } from 'primeng/toast';
import { MenubarModule } from 'primeng/menubar';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import Aura from '@primeng/themes/aura';


bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, AppRoutingModule, SharedModule, ToastModule, MenubarModule),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideHttpClient(withInterceptorsFromDi()),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),
    provideAnimations()
  ]
})
  .catch(err => console.error(err));
