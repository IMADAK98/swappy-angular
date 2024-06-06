import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { CommonModule } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';
import { CryptoService } from '../service/crypto.service';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CoinSearchComponent } from '../coin-search/coin-search.component';
import { ButtonModule } from 'primeng/button';

//TODO implement caching for performance optimization
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    ButtonModule,
  ],
  templateUrl: './wizard.component.html',
  styleUrl: './wizard.component.css',
})
export class WizardComponent {
  @Output() complete = new EventEmitter();

  constructor(public service: CryptoService) {}

  coinID!: string;

  ngOnInit() {
    console.log('onInit on wiz component');
  }

  handleCoinSelected(coinID: string, nextCallback: EventEmitter<any>) {
    this.coinID = coinID;
    nextCallback.emit(); // Pass the selected coin to the next step
  }

  handleComplete() {
    this.complete.emit();
  }
}
