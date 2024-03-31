import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';

type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
};

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
})
@Injectable({ providedIn: 'root' })
export class SelectComponent {
  private response!: Coin[];
  constructor(private http: HttpClient) {}

  options!: Coin[];
  optionValue: any;

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    const header = new HttpHeaders({
      'x-cg-demo-api-key': 'CG-t2fULRj8tKAmwZ3VJNJ3uBpt',
    });

    this.http
      .get<
        Coin[]
      >('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd', { headers: header })
      .subscribe((data) => {
        this.options = data;
      });
  }

  onClick() {
    const header = new HttpHeaders({
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlbWFkQGdtYWlsLmNvbSIsImlhdCI6MTcxMTg0MjUxMCwiZXhwIjoxNzExODQzOTUwfQ.RQnIF5Q03HTPCCha4fVACQpP2TocMUJJaPUUy29ul0Y',
    });
    const req = this.http.get('http://localhost:8000/api/v1/users');

    req.subscribe((res) => {
      console.log(res);
    });
  }
}
