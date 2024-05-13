import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { PortfolioService } from '../service/portfolio.service';
import { Portfolio } from '../interfaces/portfolio.interface';
import { catchError, of } from 'rxjs';

export const portfolioResovler: ResolveFn<Portfolio | null> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  console.log('excuting resolver !!');

  const portfolio = inject(PortfolioService).getPortfolio();

  return portfolio;
};
