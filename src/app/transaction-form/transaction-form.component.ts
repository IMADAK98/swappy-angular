import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

import {
  FormsModule,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Action } from '../interfaces/portfolio.interface';
import { Subscription, firstValueFrom } from 'rxjs';
import { RippleModule } from 'primeng/ripple';
import {
  Coin,
  CoinResponse,
  Transaction,
} from '../interfaces/crypto.interfaces';
import { TransactionService } from '../service/transaction.service';
import { CryptoService } from '../service/crypto.service';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SelectButtonModule,
    InputNumberModule,
    CalendarModule,
    InputNumberModule,
    ButtonModule,
    CommonModule,
    RippleModule,
  ],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.css',
})
export class TransactionFormComponent {
  @Output() back: EventEmitter<any> = new EventEmitter<any>();
  @Output() next: EventEmitter<any> = new EventEmitter<any>();
  @Input() selectedCoin: Coin | undefined;

  valueChangesSubscription: Subscription | undefined;
  stateOptions: any[] = [
    { label: 'Buy', value: 'BUY' },
    { label: 'Sell', value: 'SELL' },
  ];
  coin!: CoinResponse;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    public service: CryptoService,
  ) {}

  wizForm = this.fb.group({
    action: new FormControl<Action | null>(Action.BUY, Validators.required),
    date: [new Date(), [Validators.required]],
    amount: [0, [Validators.required, Validators.min(0.002)]],
    //TODO apply custom validation for price > 0
    price: [0, [Validators.required]],
    total: [
      { value: 0, disabled: true },
      Validators.required,
      Validators.min(1),
    ],
  });

  //TODO check this init method and the logic later
  async ngOnInit(): Promise<void> {
    console.log('on init on form ');
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.subscribeToValueChanges();
    // Fetch initial coin list using a separate function for clarity
    const coinResponse = await firstValueFrom(
      this.service.fetchPrice(this.selectedCoin?.id!),
    );
    console.log(coinResponse);
    if (coinResponse) {
      this.setPrice(coinResponse.quote.USD.price);
      this.coin = coinResponse;
    } else {
      // Handle empty response
      console.warn('No price data found for selected option.');
      // ...
    }
  }

  subscribeToValueChanges() {
    this.valueChangesSubscription = this.wizForm.valueChanges.subscribe(() => {
      this.calculateTotal();
    });
  }

  unsubscribeFromValueChanges() {
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.unsubscribeFromValueChanges();
    this.wizForm.reset();
  }

  onSubmit() {
    this.load(); // Trigger the loading state
    const transaction: Transaction = {
      coinId: this.coin.id,
      action: this.action?.value!,
      amount: this.amount?.value!,
      price: this.price?.value!,
      date: this.date?.value!,
      coinName: this.coin.name,
      coinSymbol: this.coin.symbol,
    };

    this.transactionService.createTransaction(transaction).subscribe({
      next: (data) => console.log(data),
      complete: () => {
        this.loading = false;
        this.next.emit();
      },
    });
  }

  calculateTotal() {
    const price = this.price?.value;
    const amount = this.amount?.value;

    if (!price || !amount || amount <= 0) {
      this.wizForm.get('total')?.setValue(0, { emitEvent: false });
      return;
    }

    let total: number;
    total = price * amount;

    this.wizForm.get('total')?.setValue(total, { emitEvent: false });
  }

  get ActionEnum() {
    return Action;
  }

  setAction(action: Action) {
    this.wizForm.get('action')?.setValue(action);
  }

  get action() {
    return this.wizForm.get('action');
  }

  setPrice(price: number) {
    this.wizForm.get('price')?.setValue(price);
  }
  get price() {
    return this.wizForm.get('price');
  }

  setAmount(amount: number): void {
    this.wizForm.get('amount')?.setValue(amount);
  }
  get amount() {
    return this.wizForm.get('amount');
  }

  setDate(date: Date) {
    this.wizForm.get('date')?.setValue(date);
  }
  get date() {
    return this.wizForm.get('date');
  }

  get total() {
    return this.wizForm.get('total');
  }

  loading: boolean = false;

  load() {
    this.loading = true;
  }
}
