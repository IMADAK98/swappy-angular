import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './auth/auth.guard';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AssetsTableComponent } from './components/assets-table/assets-table.component';
import { PortfolioWizardComponent } from './components/portfolio-wizard/portfolio-wizard.component';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { TransactionsComponent } from './components/transactions-table/transactions.component';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';
import { PiChartComponent } from './components/pi-chart/pi-chart.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoginComponent } from './components/login/login.component';
import { WizardComponent } from './components/wizard/wizard.component';
import { PortfolioComponent } from './components/new-portfolio-form/new-portfolio-form.component';
import { NoPortfolioComponent } from './components/no-portfolio/no-portfolio.component';
import { portfolioGuard } from './portfolio.guard';
import { noPortfolioGuard } from './no-portfolio.guard';
import { slideInAnimation } from './animations'; // Adjust the path as necessary
import { animation } from '@angular/animations';
import { LineChartComponent } from './components/line-chart/line-chart.component';

export const routes: Routes = [
  {
    path: 'home',
    title: 'home page',
    component: HomeComponent,
    data: { animation: 'HomePage' },
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
    canActivate: [authGuard, portfolioGuard],
    data: { animation: 'DashboardPage' },
  },

  {
    path: 'no-portfolio',
    component: NoPortfolioComponent,
    title: 'no portfolio',
    canActivate: [authGuard, noPortfolioGuard],
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
    path: 'header',
    component: HeaderComponent,
  },

  {
    path: 'sidebar',
    component: SidebarComponent,
  },

  {
    path: 'line-chart',
    component: LineChartComponent,
  },

  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
