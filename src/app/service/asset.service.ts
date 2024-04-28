import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Asset } from '../interfaces/crypto.interfaces';
import { catchError, count, delay, retry } from 'rxjs';
import { customErrorHandler } from '../errors/handleError';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  constructor(private http: HttpClient) {}

  fetchAssetsByPortfolioId(portfolioId: number) {
    return this.http
      .get<
        Asset[]
      >(`http://localhost:8100/api/v1/assets/portfolio/${portfolioId}`)
      .pipe(
        retry({ count: 3, delay: 2000 }),
        catchError((err) => customErrorHandler(err)),
      );
  }
}
