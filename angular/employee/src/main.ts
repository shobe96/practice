

import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import Aura from '@primeng/themes/aura';
import { appRoutes } from './app/app.routes';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { authInterceptor } from './app/shared/data-access/interceptors/auth/auth.interceptor';
import { errorInterceptor } from './app/shared/data-access/interceptors/error/error.interceptor';


bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideHttpClient(withInterceptorsFromDi()),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),
    provideAnimations(),
    appRoutes,
    MessageService,
    DialogService,
    ConfirmationService
  ]
})
  .catch(err => console.error(err));
