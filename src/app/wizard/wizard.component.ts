import { Component, EventEmitter, Output } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { CommonModule } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';
import { CryptoService } from '../service/crypto.service';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CoinSearchComponent } from '../coin-search/coin-search.component';
import { Coin } from '../interfaces/crypto.interfaces';
//TODO implement caching for performance optimization
@Component({
  selector: 'app-wizard',
  standalone: true,
  imports: [
    StepperModule,
    NgOptimizedImage,
    CommonModule,
    FormsModule,
    TransactionFormComponent,
    InputTextModule,
    CoinSearchComponent,
  ],
  templateUrl: './wizard.component.html',
  styleUrl: './wizard.component.css',
})
export class WizardComponent {
  @Output() complete = new EventEmitter();

  constructor(public service: CryptoService) {}

  selectedCoin: Coin | undefined;

  ngOnInit() {
    console.log('onInit on wiz component');
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    console.log('destroyed the wizard instance');
  }

  handleCoinSelected(coin: Coin, nextCallback: EventEmitter<any>) {
    this.selectedCoin = coin;
    nextCallback.emit(); // Pass the selected coin to the next step
  }

  handleComplete() {
    this.complete.emit();
  }
}
