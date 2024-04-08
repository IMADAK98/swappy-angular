import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, catchError, map } from 'rxjs';
import { response } from 'express';
import { customErrorHandler } from '../common/handleError';
import { Asset, Portfolio } from '../interfaces/portfolio.interface';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  constructor(private http: HttpClient) {
    http: HttpClient;
  }

  getPortfolio(): Observable<Portfolio> {
    const apiUrl = environment.apiUrl;
    return this.http
      .get(
        `${apiUrl}/swappy-portfolio-service/api/v1/portfolio/get-portfolio-by-userEmail`,
      )
      .pipe(
        map((response: any) => this.mapToPortfolio(response)),
        catchError((err) => customErrorHandler(err)),
      );
  }

  private mapToPortfolio(data: any): Portfolio {
    return {
      id: data.id,
      name: data.name,
      userEmail: data.userEmail,
      preferedCurrency: data.preferedCurrency,
      asset: data.asset.map((asset: any) => this.mapToAsset(asset)),
      creationDate: new Date(data.creationDate),
    };
  }

  private mapToAsset(assetData: any): Asset {
    return {
      id: assetData.id,
      name: assetData.name,
      amount: assetData.amount,
      purchaseAmount: assetData.purchaseAmount,
      purchaseDate: new Date(assetData.purchaseDate),
      action: assetData.action,
    };
  }
}
