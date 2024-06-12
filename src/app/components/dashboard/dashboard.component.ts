import { Component, inject } from '@angular/core';
import { CardComponent } from '../../card/card.component';
import { HeaderComponent } from '../../header/header.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Observable, map } from 'rxjs';
import { Portfolio } from '../../interfaces/portfolio.interface';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../service/portfolio.service';
import { SkeletonModule } from 'primeng/skeleton';
import { AssetsTableComponent } from '../assets-table/assets-table.component';
import { CardModule } from 'primeng/card';
import { PiChartComponent } from '../pi-chart/pi-chart.component';
import { NgOptimizedImage } from '@angular/common';
import { NoAssetsComponent } from '../no-assets/no-assets.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MenuActionsComponent } from '../menu-actions/menu-actions.component';
import { WizardComponent } from '../wizard/wizard.component';
import { PortfolioComponent } from '../new-portfolio-form/new-portfolio-form.component';
import { NoPortfolioComponent } from '../no-portfolio/no-portfolio.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
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
    NgOptimizedImage,
    NoAssetsComponent,
    RouterLink,
    MenuActionsComponent,
    NoPortfolioComponent,
  ],
})
export class DashboardComponent {
  private activatedRoute = inject(ActivatedRoute);
  portfolio$!: Observable<Portfolio | null>;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    //shared service solution
    // this.portfolio$ = this.portfolioService.getPortfolio();

    //resolver solution
    this.portfolio$ = this.activatedRoute.data.pipe(
      map((data) => data['portfolio']),
    );

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

  showFormDialog = false;

  showDialog() {
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
    // this.loading = true;
    this.ngOnInit();
  }

  showForm() {
    this.showFormDialog = true;
  }
}
