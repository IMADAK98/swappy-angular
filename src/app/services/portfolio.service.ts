import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  shareReplay,
  tap,
} from 'rxjs';
import { customErrorHandler } from '../errors/handleError';
import {
  Portfolio,
  PortfolioRequest,
  PortfolioResponse,
  StatsResponse,
} from '../interfaces/portfolio.interface';
import { Asset } from '../interfaces/crypto.interfaces';
import { CentralizedStateService } from '../centralized-state.service';
import { Router } from '@angular/router';

export interface IPortfolioService {
  getPortfolio(): Observable<Portfolio | null>;
  fetchPortfolio(): Observable<Portfolio | null>;
  createPortfolio(
    portfolioReq: PortfolioRequest,
  ): Observable<PortfolioResponse | void>;
  refreshPortfolio(): void;
  deletePortfolio(portfolioId: number): Observable<void>;
}

@Injectable({
  providedIn: 'root',
})
export class PortfolioService implements IPortfolioService {
  private portfolioSubject = new BehaviorSubject<Portfolio | null>(null);

  apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private cs: CentralizedStateService,
    private router: Router,
  ) {
    // this.fetchPortfolio().subscribe((portfolio: Portfolio | null) => {
    //   this.portfolioSubject.next(portfolio);
    // });
  }

  getPortfolioV2(): Observable<PortfolioResponse> {
    return this.http.get<PortfolioResponse>(
      `${this.apiUrl}swappy-portfolio-service/api/v1/portfolio-by-email`,
    );
    //  .pipe(
    //     map((response: Portfolio) => this.mapToPortfolio(response)),
    //     catchError((err) => {
    //       customErrorHandler(err);
    //       return of(null); // Return null in case of an error
    //     }),
    //     shareReplay(1),
    //   );
  }

  getPortfolioStats(): Observable<StatsResponse> {
    return this.http
      .get<StatsResponse>(
        `${this.apiUrl}swappy-portfolio-service/api/v1/portfolio/statistics`,
      )
      .pipe(catchError((err) => customErrorHandler(err)));
  }

  checkPortfolioExistance(): Observable<boolean> {
    return this.http
      .get<PortfolioResponse>(
        `${this.apiUrl}swappy-portfolio-service/api/v1/portfolio-by-email`,
      )
      .pipe(
        tap((response: PortfolioResponse) => {
          if (response.data) {
            this.portfolioSubject.next(this.mapToPortfolio(response.data));
          } else {
            this.portfolioSubject.next(null);
          }
        }),
        map((response: PortfolioResponse) => !!response.data), // !! converts to boolean
        catchError((err) => {
          if (err.status === 404) {
            console.log(err);
            return of(false);
          } else {
            customErrorHandler(err);
            return of(false);
          }
        }),
      );
  }

  hasPortfolio(): Observable<boolean> {
    return this.http
      .get<PortfolioResponse>(
        `${this.apiUrl}swappy-portfolio-service/api/v1/has-portfolio`,
      )
      .pipe(
        map((response: PortfolioResponse) => !!response.data), //!! converts to boolean
        catchError((err) => {
          if (err.status === 404) {
            console.log(err);
            return of(false);
          } else {
            customErrorHandler(err);
            return of(false);
          }
        }),
      );
  }

  // fetchPortfolio(): Observable<Portfolio | null> {
  //   const apiUrl = environment.apiUrl;
  //   return this.http
  //     .get<PortfolioResponse>(
  //       `${apiUrl}swappy-portfolio-service/api/v1/portfolio-by-email`,
  //     )
  //     .pipe(
  //       map((response: PortfolioResponse) =>
  //         this.mapToPortfolio(response.data),
  //       ),
  //       catchError((err) => {
  //         customErrorHandler(err);
  //         return of(null); // Return null in case of an error
  //       }),
  //       shareReplay(1),
  //     );
  // }

  // Fetches portfolio data from the backend and returns an observable
  fetchPortfolio(): Observable<Portfolio | null> {
    return this.http
      .get<PortfolioResponse>(
        `${this.apiUrl}swappy-portfolio-service/api/v1/portfolio-by-email`,
      )
      .pipe(
        map((response: PortfolioResponse) =>
          this.mapToPortfolio(response.data),
        ),
        catchError((err) => {
          customErrorHandler(err);
          return of(null); // Return null in case of an error
        }),
        shareReplay(1),
      );
  }

  // Method to trigger portfolio data update
  triggerUpdatePortfolioData(): void {
    this.fetchPortfolio().subscribe({
      next: (portfolio) => this.portfolioSubject.next(portfolio),
      error: (error: any) => customErrorHandler(error),
    });
  }

  createPortfolio(
    portfolioReq: PortfolioRequest,
  ): Observable<PortfolioResponse | void> {
    return this.http
      .post<PortfolioResponse>(
        `${this.apiUrl}swappy-portfolio-service/api/v1/portfolio`,
        portfolioReq,
      )
      .pipe(
        tap((response: PortfolioResponse) => {
          if (response.data) {
            console.log(response.data);
            this.portfolioSubject.next(this.mapToPortfolio(response.data));
          } else {
            this.portfolioSubject.next(null);
          }
        }),
        catchError((err) => customErrorHandler(err)),
      );
  }

  getPortfolio(): Observable<Portfolio | null> {
    return this.portfolioSubject.asObservable();
  }

  deletePortfolio(portfolioId: number): Observable<void> {
    return this.http
      .delete<void>(
        `${this.apiUrl}swappy-portfolio-service/api/v1/portfolio/${portfolioId}`,
      )
      .pipe(catchError((error: any) => customErrorHandler(error)));
  }

  refreshPortfolio() {
    this.fetchPortfolio().subscribe((portfolio) => {
      this.portfolioSubject.next(portfolio);
    });
    this.cs.triggerRefresh();
  }

  updatePortfolioData(): Observable<any> {
    return this.http
      .get<PortfolioResponse>(
        `${this.apiUrl}swappy-portfolio-service/api/v1/portfolio-by-email`,
      )
      .pipe(
        tap((response: PortfolioResponse) => {
          if (response.data) {
            this.portfolioSubject.next(this.mapToPortfolio(response.data));
          } else {
            this.portfolioSubject.next(null);
          }
        }),
        catchError((err) => {
          customErrorHandler(err);
          return of(null);
        }),
      );
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
