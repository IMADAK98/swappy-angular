import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { noPortfolioGuard } from './no-portfolio.guard';

describe('noPortfolioGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => noPortfolioGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
