import { Component, Input } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PortfolioService } from '../service/portfolio.service';
import { Portfolio } from '../interfaces/portfolio.interface';

enum CURRENCY {
  USD = 'USD',
  EUR = 'EUR',
  SAR = 'SAR',
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [
    StepperModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    DividerModule,
    DropdownModule,
    InputTextModule,
  ],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css',
})
export class PortfolioComponent {
  portfolioForm: FormGroup;
  portfolio!: Portfolio;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
  ) {
    this.portfolioForm = this.fb.group({
      name: new FormControl<string | ''>('', Validators.required),
      currency: new FormControl<CURRENCY | null>(null, Validators.required),
    });
  }

  ngOnInit(): void {
    this.portfolioService.getPortfolio().subscribe((portfolio: Portfolio) => {
      this.portfolio = portfolio;
      console.log(portfolio);
    });
  }

  currencyOptions: any[] = [
    {
      value: CURRENCY.USD,
      label: 'USD',
    },

    {
      value: CURRENCY.EUR,
      label: 'EUR',
    },

    {
      value: CURRENCY.SAR,
      label: 'SAR',
    },
  ];

  onSubmit() {
    console.log(this.portfolioForm.value);
  }
}
