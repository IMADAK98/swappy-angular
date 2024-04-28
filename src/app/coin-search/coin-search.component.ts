import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Coin } from '../interfaces/crypto.interfaces';
import { FormsModule } from '@angular/forms';
import { CryptoService } from '../service/crypto.service';
import {
  Observable,
  Subject,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap,
} from 'rxjs';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-coin-search',
  standalone: true,
  imports: [AsyncPipe, FormsModule, NgOptimizedImage],
  templateUrl: './coin-search.component.html',
  styleUrl: './coin-search.component.css',
})
export class CoinSearchComponent {
  @Output() next = new EventEmitter();
  @Output() coinSelected = new EventEmitter();

  searchTerm: string = '';
  coins$: Observable<Coin[]> = new Observable<Coin[]>();
  protected onInput$ = new Subject<string>();

  constructor(public service: CryptoService) {}

  ngOnInit(): void {
    this.coins$ = this.fetchInitialTopCoins();

    this.onInput$
      .pipe(
        debounceTime(1000), // Wait for 300ms after each keystroke
        distinctUntilChanged(), // Ignore if the search term hasn't changed
        switchMap((term) => this.searchCoins(term)),
      )
      .subscribe((filteredCoins) => {
        this.coins$ = of(filteredCoins);
      });
  }

  fetchInitialTopCoins(): Observable<Coin[]> {
    return this.service
      .getAllCoins()
      .pipe(
        map((coins) => coins.sort((a, b) => a.rank - b.rank).slice(0, 100)),
      );
  }

  fetchInitialCoins() {
    this.coins$ = this.service.fetchList();
  }

  async handleClick(coinID: string, next: EventEmitter<any>) {
    next.emit();
    this.coinSelected.emit(coinID);
  }

  onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value.trim();
    this.onInput$.next(this.searchTerm);
  }

  searchCoins(term: string): Observable<Coin[]> {
    if (term === '') {
      return this.fetchInitialTopCoins();
    } else {
      return this.service
        .getAllCoins()
        .pipe(
          map((coins) =>
            coins
              .filter(
                (coin) =>
                  coin.name.toLowerCase().includes(term.toLowerCase()) ||
                  coin.symbol.toLowerCase().includes(term.toLowerCase()),
              )
              .slice(0, 20),
          ),
        );
    }
  }
}
