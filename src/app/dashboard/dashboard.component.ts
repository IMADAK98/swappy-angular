import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Coin } from '../select/select.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgOptimizedImage } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { CardComponent } from '../card/card.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { NgClass, NgStyle } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { HeaderComponent } from '../header/header.component';
import { PortfolioComponent } from '../portfolio/portfolio.component';
import { initFlowbite } from 'flowbite';
import {
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';

enum Action {
  BUY,
  SELL,
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    PortfolioComponent,
    TableModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    CalendarModule,
    FormsModule,
    DividerModule,
    CardModule,
    CardComponent,
    SelectButtonModule,
    NgClass,
    NgStyle,
    DropdownModule,
    InputNumberModule,
    InputTextModule,
    HeaderComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  investForm: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
  ) {
    this.investForm = this.fb.group({
      date: new FormControl<Date | null>(new Date()),
      name: new FormControl<string>(''),
      amount: new FormControl<number | null>(null),
      purchasingAmount: new FormControl<number | null>(null),
      action: new FormControl<Action | null>(null, Validators.required),
    });
  }
  hasPortfolio: boolean = false;
  stateOptions: any[] = [
    { label: 'Buy', value: 'BUY' },
    { label: 'Sell', value: 'SELL' },
  ];

  products = [
    {
      code: 'PRD-123',
      name: 'Product A',
      category: 'Electronics',
      quantity: 10,
    },
    { code: 'PRD-456', name: 'Product B', category: 'Clothing', quantity: 5 },
    { code: 'PRD-789', name: 'Product C', category: 'Furniture', quantity: 2 },
    // ... add more product objects as needed
  ];
  ngOnInit(): void {
    initFlowbite();
  }

  printNumber(event: any): void {
    console.log(event);
  }

  changeStyle(): string {
    if (this.investForm.get('action')?.value == 'Buy') {
      return 'p-highlight2';
    }
    return '';
  }

  onSubmit() {
    console.log(this.investForm.value);
  }
}
