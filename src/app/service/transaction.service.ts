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

  createTransaction(transaction: Transaction): Observable<boolean> {
    const url = environment.apiUrl;
    return this.http
      .post<Transaction>(
        `${url}swappy-portfolio-service/api/v1/transaction`,
        transaction,
      )
      .pipe(
        map(() => true),
        retry({ count: 3, delay: 1000 }),
        catchError((err) => {
          customErrorHandler(err);
          return of(false);
        }),
      );
  }
}
