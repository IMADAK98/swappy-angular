import { Component } from '@angular/core';
import { CardComponent } from '../../card/card.component';
import { HeaderComponent } from '../../header/header.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Observable } from 'rxjs';
import { Portfolio } from '../../interfaces/portfolio.interface';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../service/portfolio.service';
import { SkeletonModule } from 'primeng/skeleton';
import { AssetsTableComponent } from '../assets-table/assets-table.component';
import { CardModule } from 'primeng/card';
import { PiChartComponent } from '../pi-chart/pi-chart.component';
import { NgOptimizedImage } from '@angular/common';
import { NoAssetsComponent } from '../no-assets/no-assets.component';
import { RouterLink } from '@angular/router';
import { MenuActionsComponent } from '../menu-actions/menu-actions.component';
import { WizardComponent } from '../wizard/wizard.component';
import { PortfolioComponent } from '../new-portfolio-form/new-portfolio-form.component';
import { NoPortfolioComponent } from '../no-portfolio/no-portfolio.component';
import { LineChartComponent } from '../line-chart/line-chart.component';
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
    LineChartComponent,
  ],
})
export class DashboardComponent {
  portfolio$!: Observable<Portfolio | null>;

  constructor(private pService: PortfolioService) {}

  ngOnInit(): void {
    this.pService.triggerUpdatePortfolioData();
    this.portfolio$ = this.pService.getPortfolio();
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

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }
}
