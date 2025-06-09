import { Injectable, inject } from '@angular/core';
import { OAuthService, OAuthEvent, OAuthErrorEvent } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';
import { authConfig } from './auth.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private oauthService = inject(OAuthService);
  private router = inject(Router);
  
  // Observable per tracciare lo stato di autenticazione
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  // Observable per tracciare i dati dell'utente
  private userProfileSubject = new BehaviorSubject<any>(null);
  public userProfile$ = this.userProfileSubject.asObservable();

  constructor() {
    this.configureOAuth();
    this.setupEventHandlers();
  }

  private configureOAuth(): void {
    // Applica la configurazione OAuth
    this.oauthService.configure(authConfig);
    
    // Carica il discovery document (informazioni sull'IdentityServer)
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      // Verifica se l'utente è già autenticato (es. refresh della pagina)
      if (this.oauthService.hasValidAccessToken()) {
        this.isAuthenticatedSubject.next(true);
        this.loadUserProfile();
      }
    }).catch(error => {
      console.error('Errore durante il caricamento del discovery document:', error);
    });
  }

  private setupEventHandlers(): void {
    // Gestisci gli eventi OAuth per tracciare lo stato dell'autenticazione
    this.oauthService.events
      .pipe(filter(e => e.type === 'token_received'))
      .subscribe(() => {
        console.log('Token ricevuto con successo');
        this.isAuthenticatedSubject.next(true);
        this.loadUserProfile();
        
        // Reindirizza alla home page o alla pagina precedente
        const targetUrl = localStorage.getItem('auth_redirect_url') || '/';
        localStorage.removeItem('auth_redirect_url');
        this.router.navigateByUrl(targetUrl);
      });

    this.oauthService.events
      .pipe(filter(e => e.type === 'logout'))
      .subscribe(() => {
        console.log('Logout completato');
        this.isAuthenticatedSubject.next(false);
        this.userProfileSubject.next(null);
      });

    // Gestisci gli errori di autenticazione
    this.oauthService.events
      .pipe(filter(e => e instanceof OAuthErrorEvent))
      .subscribe((e: OAuthErrorEvent) => {
        console.error('Errore OAuth:', e);
        // Qui puoi implementare la gestione degli errori
      });
  }

  // Metodo per iniziare il processo di login
  public login(targetUrl?: string): void {
    // Salva l'URL di destinazione per il redirect post-login
    if (targetUrl) {
      localStorage.setItem('auth_redirect_url', targetUrl);
    }
    
    // Inizia il flusso di autenticazione
    this.oauthService.initLoginFlow();
  }

  // Metodo per il logout
  public logout(): void {
    this.oauthService.logOut();
  }

  // Metodo per verificare se l'utente è autenticato
  public isAuthenticated(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  // Metodo per ottenere l'access token
  public getAccessToken(): string | null {
    return this.oauthService.getAccessToken();
  }

  // Metodo per ottenere i claims dell'utente
  public getUserClaims(): any {
    return this.oauthService.getIdentityClaims();
  }

  // Metodo per caricare il profilo utente
  private loadUserProfile(): void {
    this.oauthService.loadUserProfile().then((profile: any) => {
      this.userProfileSubject.next(profile);
      console.log('Profilo utente caricato:', profile);
    }).catch(error => {
      console.error('Errore nel caricamento del profilo utente:', error);
    });
  }

  // Metodo per rinnovare i token automaticamente
  public refreshToken(): Promise<boolean> {
    return this.oauthService.refreshToken().then(() => {
      return this.oauthService.hasValidAccessToken();
    }).catch(error => {
      console.error('Errore nel refresh del token:', error);
      return false;
    });
  }

  // Metodo helper per ottenere l'header Authorization per le chiamate API
  public getAuthorizationHeader(): { [header: string]: string } {
    const token = this.getAccessToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
}