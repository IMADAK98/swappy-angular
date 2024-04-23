// import { inject } from '@angular/core';
// import {
//   ActivatedRouteSnapshot,
//   CanActivateFn,
//   Router,
//   RouterStateSnapshot,
// } from '@angular/router';
// import { AuthService } from './auth.service';

// export const authGuard: CanActivateFn = (
//   route: ActivatedRouteSnapshot,
//   state: RouterStateSnapshot,
// ) => {
//   console.log('guard activated');
//   const authService: AuthService = inject(AuthService);
//   const router: Router = inject(Router);
//   // console.log(authService.currentUser());
//   if (authService.isLoggedIn()) return true;
//   return router.createUrlTree(['/login'], {
//     queryParams: { returnUrl: state.url },
//   });
// };

import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
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
  if (isPlatformServer(inject(PLATFORM_ID))) {
    return false;
  }
  console.log('guard activated');
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  if (authService.isLoggedIn()) return true;
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};
