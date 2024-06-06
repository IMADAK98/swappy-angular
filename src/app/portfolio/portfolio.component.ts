import { Component } from '@angular/core';
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
import { PortfolioService } from '../service/portfolio.service';
import { Portfolio } from '../interfaces/portfolio.interface';
import { Router } from '@angular/router';

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
  hasPortfolio = false;
  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private router: Router,
  ) {
    this.portfolioForm = this.fb.group({
      name: new FormControl<string | ''>('', Validators.required),
      preferedCurrency: new FormControl<CURRENCY | null>(
        null,
        Validators.required,
      ),
    });
  }

  // ngOnInit(): void {
  //   this.portfolioService.getPortfolio().subscribe((portfolio: Portfolio[]) => {
  //     this.portfolio = portfolio;
  //     console.log(portfolio);
  //   });
  // }

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

  onSubmit(portfolio: Portfolio) {
    this.portfolioService
      .createPortfolio(portfolio)
      .subscribe((portfolio: Portfolio) => {
        console.log(portfolio);
      });

    const currentUrl = this.router.url;

    // Navigate to the current URL
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  // ngOnInit(): void {
  //   this.portfolioService.getPortfolio().subscribe({
  //     next: (data: any) => {
  //       console.log(data);
  //     },
  //   });
  // }
}
