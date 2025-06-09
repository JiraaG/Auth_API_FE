// auth.config.ts - Configurazione centralizzata per l'autenticazione
import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  // URL del tuo server IdentityServer
  issuer: 'https://localhost:7009', // Sostituisci con l'URL del tuo server Auth_API
  // Configurazione del client che corrisponde a quella nel tuo IdentityServer
  clientId: 'angular-client',
  // Tipo di risposta per Authorization Code Flow
  responseType: 'code',
  // URL di redirect dopo il login (deve corrispondere a RedirectUris nel client)
  redirectUri: 'https://localhost:4200/auth-callback',
  // URL di redirect dopo il logout
  postLogoutRedirectUri: 'https://localhost:4200/',
  // Scopi richiesti (devono corrispondere a AllowedScopes nel client)
  scope: 'openid profile api1 offline_access',
  
  // Abilita PKCE per sicurezza aggiuntiva
  useSilentRefresh: true,
  // URL per il silent refresh (per rinnovare i token automaticamente)
  silentRefreshRedirectUri: 'https://localhost:4200/silent-refresh.html',
  
  // Configurazioni di sicurezza
  requireHttps: true, // Impostare false solo in sviluppo se necessario
  // Disabilita la validazione dell'issuer se stai usando localhost in sviluppo
  strictDiscoveryDocumentValidation: false,
  // Timeout per le operazioni
  timeoutFactor: 0.01,
  
  // Log per debug (disabilitare in produzione)
  showDebugInformation: true,
  // sessionChecksEnabled: false,     // spegne del tutto i messaggi di “session unchanged”
  sessionChecksEnabled: true,
  // sessionCheckInterval: 60,      // se vuoi lasciarlo attivo, usalo ogni 60 secondi

  // Configurazione avanzata per gestire i claims
  clearHashAfterLogin: false,
  
  // Configurazione del token storage
//   storage: localStorage
};