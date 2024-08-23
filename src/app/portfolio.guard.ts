import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { PortfolioService } from './services/portfolio.service';
import { tap, map } from 'rxjs';
import { isPlatformServer } from '@angular/common';

export const portfolioGuard: CanActivateFn = (route, state) => {
  const pService = inject(PortfolioService);
  const router = inject(Router);

  // if (isPlatformServer(inject(PLATFORM_ID))) {
  //   return false;
  // }

  return pService.hasPortfolio().pipe(
    map((portfolioExists) => {
      if (!portfolioExists) {
        router.navigateByUrl('/no-portfolio', { skipLocationChange: true });
        return false;
      }
      return true;
    }),
  );
};
