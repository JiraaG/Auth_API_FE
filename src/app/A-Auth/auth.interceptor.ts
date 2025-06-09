import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip adding headers for discovery document requests
  if (req.url.includes('/.well-known/openid-configuration')) {
    return next(req);
  }
  
  const authService = inject(AuthService);
  if (req.url.includes('https://localhost:7009') && authService.isAuthenticated()) {
    const authHeaders = authService.getAuthorizationHeader();
    const authReq = req.clone({ setHeaders: authHeaders });
    return next(authReq);
  }
  
  return next(req);
};
