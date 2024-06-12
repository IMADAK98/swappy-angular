import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  retry,
  shareReplay,
  tap,
} from 'rxjs';
import { customErrorHandler } from '../errors/handleError';
import { Portfolio, PortfolioRequest } from '../interfaces/portfolio.interface';
import { Asset } from '../interfaces/crypto.interfaces';
import { CentralizedStateService } from '../centralized-state.service';

export interface IPortfolioService {
  getPortfolio(): Observable<Portfolio | null>;
  fetchPortfolio(): Observable<Portfolio | null>;
  createPortfolio(portfolioReq: PortfolioRequest): Observable<void>;
  refreshPortfolio(): void;
  deletePortfolio(portfolioId: number): Observable<void>;
}

@Injectable({
  providedIn: 'root',
})
export class PortfolioService implements IPortfolioService {
  private portfolioSubject = new BehaviorSubject<Portfolio | null>(null);
  constructor(
    private http: HttpClient,
    private cs: CentralizedStateService,
  ) {
    this.fetchPortfolio().subscribe((portfolio: Portfolio | null) => {
      this.portfolioSubject.next(portfolio);
    });
  }

  fetchPortfolio(): Observable<Portfolio | null> {
    const apiUrl = environment.apiUrl;
    return this.http
      .get<Portfolio>(
        `${apiUrl}swappy-portfolio-service/api/v1/portfolio-by-email`,
      )
      .pipe(
        map((response: Portfolio) => this.mapToPortfolio(response)),
        catchError((err) => {
          customErrorHandler(err);
          return of(null); // Return null in case of an error
        }),
        shareReplay(1),
      );
  }

  createPortfolio(portfolioReq: PortfolioRequest): Observable<void> {
    const apiUrl = environment.apiUrl;
    return this.http
      .post<void>(
        `${apiUrl}swappy-portfolio-service/api/v1/portfolio`,
        portfolioReq,
      )
      .pipe(
        retry({ count: 3, delay: 3000 }),
        catchError((err) => customErrorHandler(err)),
      );
  }

  getPortfolio(): Observable<Portfolio | null> {
    return this.portfolioSubject.asObservable();
  }

  deletePortfolio(portfolioId: number): Observable<void> {
    const apiUrl = environment.apiUrl;
    return this.http
      .delete<void>(
        `${apiUrl}swappy-portfolio-service/api/v1/portfolio/${portfolioId}`,
      )
      .pipe(
        tap(() => {
          this.refreshPortfolio(), console.log('tap gettng action');
        }),
        catchError((error: any) => customErrorHandler(error)),
      );
  }

  refreshPortfolio() {
    this.fetchPortfolio().subscribe((portfolio) => {
      this.portfolioSubject.next(portfolio);
    });
    this.cs.triggerRefresh();
  }

  private mapToPortfolio(data: Portfolio): Portfolio {
    return {
      id: data.id,
      portfolioName: data.portfolioName,
      userEmail: data.userEmail,
      assets: data.assets.map((asset: Asset) => this.mapToAsset(asset)),
      creationDate: new Date(data.creationDate),
      totalValue: data.totalValue,
      totalProfitAndLossAmount: data.totalProfitAndLossAmount,
    };
  }

  private mapToAsset(assetData: Asset): Asset {
    return {
      id: assetData.id,
      symbol: assetData.symbol,
      coinId: assetData.coinId,
      avgBuyPrice: assetData.avgBuyPrice,
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
