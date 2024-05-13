import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, catchError, map, of, retry } from 'rxjs';
import { Transaction } from '../interfaces/crypto.interfaces';
import { customErrorHandler } from '../errors/handleError';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private http: HttpClient) {}
  url = environment.apiUrl;
  createTransaction(transaction: Transaction): Observable<boolean> {
    return this.http
      .post<Transaction>(
        `${this.url}swappy-portfolio-service/api/v1/transaction`,
        transaction,
      )
      .pipe(
        map(() => true),
        catchError((err) => {
          customErrorHandler(err);
          return of(false);
        }),
      );
  }

  getTransactionsByAssetId(assetId: number): Observable<Transaction[]> {
    return this.http
      .get<
        Transaction[]
      >(`${this.url}swappy-portfolio-service/api/v1/transactions/asset/${assetId}`)
      .pipe(
        retry(3),
        catchError((err) => customErrorHandler(err)),
      );
  }
}
