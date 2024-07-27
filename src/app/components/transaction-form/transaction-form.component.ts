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
  FormGroup,
} from '@angular/forms';
import { Action } from '../../interfaces/portfolio.interface';
import { Subscription, debounceTime } from 'rxjs';
import {
  CoinResponse,
  TransactionRequest,
} from '../../interfaces/crypto.interfaces';
import { TransactionService } from '../../service/transaction.service';
import { CryptoService } from '../../service/crypto.service';
import { LoadingService } from '../../loading-indicator/loading-utils/loading.service';
import { CentralizedStateService } from '../../centralized-state.service';

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
  ],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.css',
})
export class TransactionFormComponent {
  @Output() completedSubmission: EventEmitter<any> = new EventEmitter<any>();
  @Input() coinID: string = '';
  coin!: CoinResponse;
  valueChangesSubscription: Subscription | undefined;
  stateOptions: any[] = [
    { label: 'Buy', value: 'BUY' },
    { label: 'Sell', value: 'SELL' },
  ];
  wizForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    public cryptoService: CryptoService,
    private loadingService: LoadingService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.subscribeToValueChanges();
    this.fetchCoinPrice(this.coinID);
  }

  private subscribeToValueChanges(): void {
    this.valueChangesSubscription = this.wizForm?.valueChanges
      .pipe(debounceTime(300)) // Debounce to reduce the frequency of value changes
      .subscribe(() => {
        this.calculateTotal();
      });
  }

  initForm() {
    this.wizForm = this.fb.group({
      action: [Action.BUY, Validators.required],
      date: [new Date(), [Validators.required]],
      amount: [0, [Validators.required, Validators.min(0.002)]],
      price: [0, [Validators.required]],
      total: [
        { value: 0, disabled: true },
        Validators.required,
        Validators.min(1),
      ],
    });
  }

  private fetchCoinPrice(coinID: string): void {
    if (!coinID) {
      console.error('Coin ID is required');
      return;
    }

    // this.loadingService.loadingOn();
    this.cryptoService.fetchPrice(coinID).subscribe({
      next: (data) => this.handleFetchPriceSuccess(data),
      error: (err) => this.handleFetchPriceError(err),
      // complete: () => this.loadingService.loadingOff(),
    });
  }

  private handleFetchPriceSuccess(data: CoinResponse): void {
    this.setPrice(data.quote.USD.price);
    this.coin = data;
  }

  private handleFetchPriceError(err: any): void {
    console.error('Failed to fetch coin price', err);
    // Optionally, show an error message to the user
    // this.notificationService.showError('Failed to fetch coin price');
  }

  onSubmit(): void {
    this.loadingService.loadingOn();

    if (this.isFormValid()) {
      const transaction = this.createTransactionRequest();
      this.submitTransaction(transaction);
    } else {
      this.loadingService.loadingOff();
      // Optionally, show a validation error message to the user
      console.error('Form is invalid or coin ID is missing');
    }
  }

  private isFormValid(): boolean | undefined {
    return this.wizForm?.valid && !!this.coinID;
  }

  private createTransactionRequest(): TransactionRequest {
    return {
      coinId: this.coin.id,
      action: this.action?.value!,
      amount: this.amount?.value!,
      price: this.price?.value!,
      date: this.date?.value!,
      coinName: this.coin.name,
      coinSymbol: this.coin.symbol,
    };
  }

  private submitTransaction(transaction: TransactionRequest): void {
    this.transactionService.createTransaction(transaction).subscribe({
      next: (res) => this.handleTransactionSuccess(res),
      error: (err) => this.handleTransactionError(err),
      complete: () => this.loadingService.loadingOff(),
    });
  }

  private handleTransactionSuccess(res: any): void {
    console.log('Transaction successful:', res);
    this.completedSubmission.emit();
    // Optionally, reset the form or navigate away
  }

  private handleTransactionError(err: any): void {
    console.error('Transaction failed:', err);
    // Optionally, show an error message to the user
    // this.notificationService.showError('Transaction failed. Please try again.');
  }

  ngOnDestroy() {
    this.unsubscribeFromValueChanges();
    this.wizForm?.reset();
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

  get ActionEnum() {
    return Action;
  }

  getButtonClass(): string {
    return this.action?.value === 'SELL' ? 'sell' : 'buy';
  }

  setAction(action: Action) {
    this.wizForm?.get('action')?.setValue(action);
  }

  get action() {
    return this.wizForm?.get('action');
  }

  setPrice(price: number) {
    this.wizForm?.get('price')?.setValue(price);
  }
  get price() {
    return this.wizForm?.get('price');
  }

  setAmount(amount: number): void {
    this.wizForm?.get('amount')?.setValue(amount);
  }
  get amount() {
    return this.wizForm?.get('amount');
  }

  setDate(date: Date) {
    this.wizForm?.get('date')?.setValue(date);
  }
  get date() {
    return this.wizForm?.get('date');
  }

  get total() {
    return this.wizForm?.get('total');
  }
}
