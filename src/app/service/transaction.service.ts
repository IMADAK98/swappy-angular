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
import {
  AssetResponse,
  DeleteResponse,
  TransactionRequest,
  TransactionsResponse,
} from '../interfaces/crypto.interfaces';
import { customErrorHandler } from '../errors/handleError';
import { PortfolioService } from './portfolio.service';
import { CentralizedStateService } from '../centralized-state.service';
import { Portfolio } from '../interfaces/portfolio.interface';

export interface ITransactionService {
  createTransaction(transaction: TransactionRequest): Observable<boolean>;
  triggerFetch(): void;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService implements ITransactionService {
  private dataSubject = new BehaviorSubject<void>(undefined);

  data$: Observable<Portfolio | null> | undefined;
  constructor(
    private http: HttpClient,
    private cs: CentralizedStateService,
  ) {}
  url = environment.apiUrl;
  createTransaction(transaction: TransactionRequest): Observable<boolean> {
    return this.http
      .post<TransactionRequest>(
        `${this.url}swappy-portfolio-service/api/v1/transaction`,
        transaction,
      )
      .pipe(
        map(() => true),
        tap(() => this.cs.triggerRefresh()),
        catchError((err) => {
          customErrorHandler(err);
          return of(false);
        }),
      );
  }

  fetchTransactionsByAssetId(assetId: number) {
    return this.http
      .get<AssetResponse>(
        `${this.url}swappy-portfolio-service/api/v1/assets/transactions/${assetId}`,
      )
      .pipe(
        retry({ count: 3, delay: 2000 }),
        catchError((err) => customErrorHandler(err)),
      );
  }

  deleteTransactionById(transactionId: number) {
    return this.http
      .delete<DeleteResponse>(
        `${this.url}swappy-portfolio-service/api/v1/transaction/${transactionId}`,
      )
      .pipe(
        tap(() => this.cs.triggerRefresh()),
        catchError((err) => customErrorHandler(err)),
      );
  }

  triggerFetch() {
    this.dataSubject.next();
  }
}
