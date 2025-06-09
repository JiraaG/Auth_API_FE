import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from '../auth.config';

@Component({
  selector: 'app-auth-callback',
  imports: [],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.scss'
})
export class AuthCallbackComponent implements OnInit {
  private oauthService = inject(OAuthService);
  private router = inject(Router);

  ngOnInit() {
    console.log('[AuthCallback] init');

    this.oauthService.configure(authConfig);

    this.oauthService.loadDiscoveryDocumentAndTryLogin().then((loggedIn) => {
      console.log('[AuthCallback] Login tentato. loggedIn:', loggedIn);
      console.log('[AuthCallback] Access Token valido:', this.oauthService.hasValidAccessToken());

      if (this.oauthService.hasValidAccessToken()) {
        const redirectUrl = localStorage.getItem('auth_redirect_url') || '/home';
        localStorage.removeItem('auth_redirect_url');
        console.log('[AuthCallback] Reindirizzamento a:', redirectUrl);
        this.router.navigateByUrl(redirectUrl);
      } else {
        console.warn('[AuthCallback] Access token non valido');
      }
    }).catch(err => {
      console.error('[AuthCallback] Errore in loadDiscoveryDocumentAndTryLogin:', err);
    });
  }

}
