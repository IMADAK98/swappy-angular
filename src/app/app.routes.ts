import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { authGuard } from './auth/auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { AssetsTableComponent } from './assets-table/assets-table.component';
import { WizardComponent } from './wizard/wizard.component';
import { portfolioResovler } from './resolver/portfolio.resvoler';
import { PortfolioWizardComponent } from './portfolio-wizard/portfolio-wizard.component';
import { TransactionFormComponent } from './transaction-form/transaction-form.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';
import { PiChartComponent } from './pi-chart/pi-chart.component';

export const routes: Routes = [
  {
    path: 'home',
    title: 'home page',
    component: HomeComponent,
  },

  {
    path: 'signup',
    component: SignupComponent,
    title: 'signup',
  },

  {
    path: 'login',
    component: LoginComponent,
    title: 'login',
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'dashboard',
    canActivate: [authGuard],
    // resolve: {
    //   portfolio: portfolioResovler,
    // },
  },

  {
    path: 'wizard',
    component: WizardComponent,
  },

  {
    path: 'port-wiz',
    component: PortfolioWizardComponent,
  },

  {
    path: 'portfolio',
    component: PortfolioComponent,
  },

  {
    path: 'transactions/:id',
    component: TransactionsComponent,
  },

  {
    path: 'loading',
    component: LoadingIndicatorComponent,
  },

  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },

  {
    path: 'table',
    component: AssetsTableComponent,
  },
  {
    path: 'form',
    component: TransactionFormComponent,
  },

  {
    path: 'chart',
    component: PiChartComponent,
  },

  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
