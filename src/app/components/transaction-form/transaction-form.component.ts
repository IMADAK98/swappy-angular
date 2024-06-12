import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
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
import { Action } from '../../interfaces/portfolio.interface';
import { Subscription, debounceTime } from 'rxjs';
import { CoinResponse, Transaction } from '../../interfaces/crypto.interfaces';
import { TransactionService } from '../../service/transaction.service';
import { CryptoService } from '../../service/crypto.service';
import { LoadingService } from '../../loading-indicator/loading-utils/loading.service';
import { CentralizedStateService } from '../../centralized-state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  ],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.css',
})
export class TransactionFormComponent {
  @Output() completedSubmission: EventEmitter<any> = new EventEmitter<any>();
  @Input() coinID!: string;
  coin!: CoinResponse;
  valueChangesSubscription: Subscription | undefined;
  stateOptions: any[] = [
    { label: 'Buy', value: 'BUY' },
    { label: 'Sell', value: 'SELL' },
  ];

  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    public cryptoService: CryptoService,
    private loadingService: LoadingService,
    private cs: CentralizedStateService,
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

  ngOnInit(): void {
    console.log('on init on form ');

    this.subscribeToValueChanges();

    if (this.coinID) {
      this.fetchCoinPrice(this.coinID);
    }
  }

  private fetchCoinPrice(coinID: string): void {
    this.cryptoService.fetchPrice(coinID).subscribe({
      next: (data) => {
        this.setPrice(data.quote.USD.price);
        this.coin = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onSubmit(): void {
    this.loadingService.loadingOn();
    if (this.wizForm.valid && this.coinID) {
      const transaction: Transaction = {
        coinId: this.coin.id,
        action: this.action?.value!,
        amount: this.amount?.value!,
        price: this.price?.value!,
        date: this.date?.value!,
        coinName: this.coin.name,
        coinSymbol: this.coin.symbol,
      };
      this.submitTransaction(transaction);
    } else {
      this.loadingService.loadingOff();
    }
  }

  private submitTransaction(transaction: Transaction): void {
    this.transactionService.createTransaction(transaction).subscribe({
      next: (res) => console.log(res),
      error: (err) => console.log(err),
      complete: () => {
        this.loadingService.loadingOff();
        this.completedSubmission.emit();
      },
    });
  }

  ngOnDestroy() {
    this.unsubscribeFromValueChanges();
    this.wizForm.reset();
  }

  private subscribeToValueChanges(): void {
    this.valueChangesSubscription = this.wizForm.valueChanges
      .pipe(debounceTime(300)) // Debounce to reduce the frequency of value changes
      .subscribe(() => {
        this.calculateTotal();
      });
  }

  private unsubscribeFromValueChanges() {
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }
  }

  private calculateTotal() {
    const price = this.price?.value;
    const amount = this.amount?.value;

    if (!price || !amount || amount <= 0) {
      this.total?.setValue(0, { emitEvent: false });
      return;
    }
    // two total variables definetly shit practices ...
    let total: number;
    total = price * amount;

    this.total?.setValue(total, { emitEvent: false });
  }

  load() {
    this.loading = true;
  }

  get ActionEnum() {
    return Action;
  }

  getButtonClass(): string {
    return this.action?.value === 'SELL' ? 'sell' : 'buy';
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
}
