import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import {
  Observable,
  catchError,
  count,
  delay,
  map,
  retry,
  switchMap,
  tap,
} from 'rxjs';
import { customErrorHandler } from '../errors/handleError';
import { response } from 'express';
import { Portfolio } from '../interfaces/portfolio.interface';
import { Asset, CoinResponse } from '../interfaces/crypto.interfaces';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  constructor(private http: HttpClient) {}

  getPortfolio(): Observable<Portfolio> {
    const apiUrl = environment.apiUrl;
    return this.http
      .get<Portfolio>(
        `${apiUrl}swappy-portfolio-service/api/v1/portfolio-by-email`,
      )
      .pipe(
        tap((response) => console.log('API Response:', response)),
        retry({ count: 3, delay: 4000 }),
        map((response: any) => this.mapToPortfolio(response)),

        catchError((err) => customErrorHandler(err)),
      );
  }

  createPortfolio(portfolio: Portfolio): Observable<Portfolio> {
    const apiUrl = environment.apiUrl;
    return this.http
      .post<Portfolio>(
        `${apiUrl}swappy-portfolio-service/api/v1/portfolio`,
        portfolio,
      )
      .pipe(
        retry({ count: 3, delay: 3000 }),
        map((response: Portfolio) => this.mapToPortfolio(response)),
        catchError((err) => customErrorHandler(err)),
      );
  }

  private mapToPortfolio(data: Portfolio): Portfolio {
    return {
      id: data.id,
      name: data.name,
      userEmail: data.userEmail,
      preferedCurrency: data.preferedCurrency,
      assets: data.assets.map((asset: any) => this.mapToAsset(asset)),
      creationDate: new Date(data.creationDate),
      totalValue: data.totalValue,
      totalProfitAndLossAmount: data.totalProfitAndLossAmount,
    };
  }

  private mapToAsset(assetData: Asset): Asset {
    return {
      id: assetData.id,
      coinID: assetData.coinID,
      currentPrice: assetData.currentPrice,
      name: assetData.name,
      totalValue: assetData.totalValue,
      totalQuantity: assetData.totalQuantity,
      realizedProfitLossAmount: assetData.realizedProfitLossAmount,
      unrealizedProfitLossAmount: assetData.unrealizedProfitLossAmount,
      totalProfitAndLossAmount: assetData.totalProfitAndLossAmount,
      purchaseDate: new Date(assetData.purchaseDate),
      transactions: assetData.transactions,
    };
  }
}
