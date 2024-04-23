import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgOptimizedImage } from '@angular/common';
import { Coin, CoinResponse } from '../interfaces/crypto.interfaces';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
})
@Injectable({ providedIn: 'root' })
export class SelectComponent {
  constructor(private http: HttpClient) {
    this.onInput$
      .pipe(
        debounceTime(500), // Wait 500ms before making the API call
        distinctUntilChanged(), // Only make the API call if the search term has changed
      )
      .subscribe((query) => {
        this.queryData(query);
      });
  }
  onInput$ = new Subject<string>();
  options!: Coin[];
  optionValue: any;

  // ngOnInit(): void {
  //   this.fetchData();
  // }

  // fetchData() {
  //   this.http
  //     .get<Coin[]>('http://localhost:8080/coins_list')
  //     .subscribe((data) => {
  //       this.options = data;
  //     });
  // }

  queryData(query: string) {
    this.http
      .get<Coin[]>('http://localhost:8080/coins', {
        params: { query },
      })
      .subscribe((coins) => {
        this.options = coins;
      });
  }

  onClick(id: number) {
    this.http
      .get<CoinResponse>('http://localhost:8080/price', { params: { id: id } })
      .subscribe((data) => {
        console.log(data.quote.USD.price);
      });
  }

  searchTerm: string = '';

  onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value;
    this.onInput$.next(this.searchTerm);
  }
}
