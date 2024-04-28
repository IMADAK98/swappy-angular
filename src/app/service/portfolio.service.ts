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
} from 'rxjs';
import { customErrorHandler } from '../errors/handleError';
import { response } from 'express';
import { Portfolio } from '../interfaces/portfolio.interface';
import { Asset } from '../interfaces/crypto.interfaces';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  constructor(private http: HttpClient) {}

  getPortfolio(): Observable<Portfolio> {
    const apiUrl = environment.apiUrl;
    return this.http
      .get<Portfolio>(
        `${apiUrl}swappy-portfolio-service/api/v1/get-portfolio-by-userEmail`,
      )
      .pipe(
        retry({ count: 3, delay: 3000 }),
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
      // asset: data.asset.map((asset: any) => this.mapToAsset(asset)),
      creationDate: new Date(data.creationDate),
      totalValue: data.totalValue,
    };
  }

  // private mapToAsset(assetData: any): Asset {
  //   return {
  //     id: assetData.id,
  //     name: assetData.name,
  //     purchaseAmount: assetData.purchaseAmount,
  //     purchaseDate: new Date(assetData.purchaseDate),
  //     action: assetData.action,
  //   };
  // }
}
