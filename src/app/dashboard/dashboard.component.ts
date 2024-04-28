import { Component, inject } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { HeaderComponent } from '../header/header.component';
import { trigger, style, animate, transition } from '@angular/animations';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { WizardComponent } from '../wizard/wizard.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Portfolio } from '../interfaces/portfolio.interface';
import { CommonModule } from '@angular/common';
import { PortfolioComponent } from '../portfolio/portfolio.component';
import { PortfolioService } from '../service/portfolio.service';
import { SkeletonModule } from 'primeng/skeleton';
import { AssetsTableComponent } from '../assets-table/assets-table.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HeaderComponent,
    CardComponent,
    DialogModule,
    ButtonModule,
    WizardComponent,
    CommonModule,
    PortfolioComponent,
    SkeletonModule,
    AssetsTableComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('1000ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class DashboardComponent {
  loading: boolean = true; // Flag to indicate loading state

  private activatedRoute = inject(ActivatedRoute);
  portfolio$: Observable<Portfolio | null> = new Observable<Portfolio | null>();

  ngOnInit(): void {
    setTimeout(() => {
      this.portfolio$ = this.portfolioService.getPortfolio();
      this.loading = false;
    }, 500);
    // this.portfolio$ = this.activatedRoute.data.pipe(
    //   map((data: { portfolio?: Portfolio }) => data.portfolio || null),
    // );
  }

  fetchData() {
    console.time('result');
    this.http.get('http://localhost:8080/allCoins').subscribe((response) => {
      console.log(response);
    });
    console.timeEnd('result');
  }
  constructor(
    private http: HttpClient,
    private portfolioService: PortfolioService,
  ) {}

  visible: boolean = false;

  portfolioVisible = false;

  showDialog() {
    this.visible = true;
    console.log(this.visible);
  }

  hideDialog() {
    this.visible = false;
    this.loading = true;
    this.ngOnInit();
  }

  showForm() {
    this.portfolioVisible = true;
  }
}
