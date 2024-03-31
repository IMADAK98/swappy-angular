import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  // console.log(authService.currentUser());
  if (authService.isLoggedIn()) return true;
  return router.createUrlTree(['/register'], {
    queryParams: { returnUrl: state.url },
  });
};
