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
  firstValueFrom,
  of,
  switchMap,
} from 'rxjs';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
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
  @Output() coinSelected = new EventEmitter<Coin>();

  @ViewChild(TransactionFormComponent)
  transactionFormComponent!: TransactionFormComponent;

  searchTerm: string = '';
  coins$: Observable<Coin[]> = new Observable<Coin[]>();
  filteredCoins$: Observable<Coin[]> = new Observable<Coin[]>();
  protected onInput$ = new Subject<string>();

  constructor(public service: CryptoService) {}

  ngOnInit(): void {
    this.fetchInitialCoins();

    this.onInput$
      .pipe(
        debounceTime(500), // Delay search for 500ms after last keystroke
        distinctUntilChanged(), // Emit only if search term changes
        switchMap((query) => this.service.queryCoin(query)),
      )
      .subscribe((coins) => {
        console.log(coins);
        this.coins$ = of(coins);
      });
  }

  fetchInitialCoins() {
    this.coins$ = this.service.fetchList();
  }

  async handleClick(coin: Coin, next: EventEmitter<any>) {
    next.emit();
    this.coinSelected.emit(coin);
  }

  onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value.trim();
    if (this.searchTerm === '') {
      this.fetchInitialCoins();
    } else {
      this.onInput$.next(this.searchTerm);
    }
  }
}
