import { CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const requiredRole = route.data['role'] as string;
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getCurrentUser().pipe(
    map(user => {
      if (user && user.role === requiredRole) {
        return true;
      } else {
        router.navigate(['/dashboard']);
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/']);
      return of(false);
    })
  );
};
