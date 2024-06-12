import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  merge,
  of,
  retry,
  switchMap,
  tap,
} from 'rxjs';
import { Transaction } from '../interfaces/crypto.interfaces';
import { customErrorHandler } from '../errors/handleError';
import { PortfolioService } from './portfolio.service';
import { CentralizedStateService } from '../centralized-state.service';
import { Portfolio } from '../interfaces/portfolio.interface';

export interface ITransactionService {
  createTransaction(transaction: Transaction): Observable<boolean>;
  getTransactionsByAssetId(assetId: number): Observable<Transaction[] | []>;
  triggerFetch(): void;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService implements ITransactionService {
  private dataSubject = new BehaviorSubject<void>(undefined);
  data$: Observable<Portfolio | null>;
  constructor(
    private http: HttpClient,
    private ps: PortfolioService,
    private cs: CentralizedStateService,
  ) {
    this.data$ = merge(this.dataSubject, this.cs.refresh$).pipe(
      switchMap(() => this.ps.getPortfolio()),
    );
  }
  url = environment.apiUrl;
  createTransaction(transaction: Transaction): Observable<boolean> {
    return this.http
      .post<Transaction>(
        `${this.url}swappy-portfolio-service/api/v1/transaction`,
        transaction,
      )
      .pipe(
        map(() => true),
        tap(() => this.ps.refreshPortfolio()),
        catchError((err) => {
          customErrorHandler(err);
          return of(false);
        }),
      );
  }

  getTransactionsByAssetId(assetId: number): Observable<Transaction[] | []> {
    return this.http
      .get<
        Transaction[]
      >(`${this.url}swappy-portfolio-service/api/v1/transactions/asset/${assetId}`)
      .pipe(
        retry(3),
        catchError((err) => {
          customErrorHandler(err);
          return of([]);
        }),
      );
  }

  triggerFetch() {
    this.dataSubject.next();
  }
}
