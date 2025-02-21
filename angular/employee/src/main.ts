

import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { authInterceptor } from './app/shared/interceptors/auth/auth.interceptor';
import { providePrimeNG } from 'primeng/config';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { MenubarModule } from 'primeng/menubar';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import Aura from '@primeng/themes/aura';
import { appRoutes } from './app/app.routes';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';


bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, ToastModule, MenubarModule),
    provideHttpClient(withInterceptors([authInterceptor])),
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
