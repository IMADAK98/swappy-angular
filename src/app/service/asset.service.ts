import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Asset } from '../interfaces/crypto.interfaces';
import { catchError, count, delay, retry, tap } from 'rxjs';
import { customErrorHandler } from '../errors/handleError';
import { PortfolioService } from './portfolio.service';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  constructor(
    private http: HttpClient,
    private ps: PortfolioService,
  ) {}

  apiurl = environment.apiUrl;
  fetchAssetsByPortfolioId(portfolioId: number) {
    return this.http
      .get<
        Asset[]
      >(`${this.apiurl}swappy-portfolio-service/api/v1/assets/portfolio/${portfolioId}`)
      .pipe(
        retry({ count: 3, delay: 2000 }),
        catchError((err) => customErrorHandler(err)),
      );
  }

  deleteAsset(assetId: number) {
    return this.http
      .delete<void>(
        `${this.apiurl}swappy-portfolio-service/api/v1/assets/${assetId}`,
      )
      .pipe(
        tap(() => this.ps.refreshPortfolio()),
        catchError((err) => customErrorHandler(err)),
      );
  }
}
