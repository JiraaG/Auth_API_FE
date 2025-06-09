import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { filter, of, switchMap, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Fai solo il login, la navigazione avverrà da /auth-callback
  authService.login(state.url);
  return false;

  // const authService = inject(AuthService);
  
  // if (authService.isAuthenticated()) {
  //   return true;
  // } else {
  //   // Salva l'URL che l'utente stava cercando di raggiungere
  //   localStorage.setItem('auth_redirect_url', state.url);
    
  //   // Inizia il processo di autenticazione
  //   authService.login(state.url);
  //   return false;
  // }
  
// Usa l'observable che traccia lo stato dell'autenticazione
//   return authService.isAuthenticated$
//     .pipe(
//       take(1),
//       switchMap((isAuthenticated) => {
//         if (isAuthenticated) {
//           return of(true);
//         } else {
//           // Se non autenticato, salva la destinazione e inizia il login
//           localStorage.setItem('auth_redirect_url', state.url);
//           authService.login(state.url);
//           return of(false);
//         }
//       })
//     );

  // return authService.isAuthenticated$.pipe(
  //   filter(auth => auth !== null), // attendi inizializzazione
  //   take(1)
  // );
};