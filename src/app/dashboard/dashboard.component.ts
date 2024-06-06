import { Component } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { HeaderComponent } from '../header/header.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { WizardComponent } from '../wizard/wizard.component';
import { Observable } from 'rxjs';
import { Portfolio } from '../interfaces/portfolio.interface';
import { CommonModule } from '@angular/common';
import { PortfolioComponent } from '../portfolio/portfolio.component';
import { PortfolioService } from '../service/portfolio.service';
import { SkeletonModule } from 'primeng/skeleton';
import { AssetsTableComponent } from '../assets-table/assets-table.component';
import { CardModule } from 'primeng/card';
import { PiChartComponent } from '../pi-chart/pi-chart.component';
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
    CardModule,
    PiChartComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  // private activatedRoute = inject(ActivatedRoute);
  portfolio$!: Observable<Portfolio | null>;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    //shared service solution
    this.portfolio$ = this.portfolioService.getPortfolio();

    //resolver solution

    // this.portfolio$ = this.activatedRoute.data.pipe(
    //   map((data) => data['portfolio']), // Extract portfolio directly using 'map'
    //   catchError((error) => {
    //     console.error('Error fetching portfolio:', error);
    //     return of(null);
    //   }),
    // );

    // this.portfolio$ = this.portfolioService.getPortfolio();
    // setTimeout(() => {
    //   this.portfolio$ = this.portfolioService.getPortfolio();
    //   // this.loading = false;
    // }, 500);
    // this.portfolio$ = this.activatedRoute.data.pipe(
    //   map((data: { portfolio?: Portfolio }) => data.portfolio || null),
    // );
  }

  visible: boolean = false;

  portfolioVisible = false;

  showDialog() {
    this.visible = true;
    console.log(this.visible);
  }

  hideDialog() {
    this.visible = false;
    // this.loading = true;
    this.ngOnInit();
  }

  showForm() {
    this.portfolioVisible = true;
  }
}
