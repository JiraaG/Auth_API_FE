import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { authInterceptor } from './A-Auth';

export const appConfig: ApplicationConfig = {
  providers: [
    // Configurazione del router
    provideRouter(routes),
    
    // Configurazione HTTP client con interceptor per l'autenticazione
    provideHttpClient(withInterceptors([authInterceptor])),
    
    // Importa il modulo OAuth
    importProvidersFrom(OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: ['https://localhost:7009'], // URL del tuo server API
        sendAccessToken: true
      }
    })),

    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: Aura } })
    
  ]
};
