import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { PortfolioService } from '../service/portfolio.service';
import { Portfolio } from '../interfaces/portfolio.interface';
import { catchError, of } from 'rxjs';

export const portfolioResovler: ResolveFn<Portfolio | null> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const router = inject(Router);
  console.log('excuting resolver !!');

  const portfolio = inject(PortfolioService);

  return portfolio.getPortfolio().pipe(
    catchError((error) => {
      console.error('Portfolio Resolver Error:', error);
      return of(null); // Wrap the error in an object and return it
    }),
  );
};
