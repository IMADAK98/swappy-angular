import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coin, CoinResponse } from '../interfaces/crypto.interfaces';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  constructor(private http: HttpClient) {}

  queryCoin(query: string): Observable<Coin[]> {
    return this.http.get<Coin[]>('http://localhost:8080/api/v1/coins', {
      params: { query },
    });
  }

  fetchList(): Observable<Coin[]> {
    return this.http.get<Coin[]>('http://localhost:8080/api/v1/coins_list');
  }

  fetchPrice(id: number): Observable<CoinResponse> {
    return this.http.get<CoinResponse>('http://localhost:8080/api/v1/price', {
      params: { coinID: id.toString() },
    });
  }
}
