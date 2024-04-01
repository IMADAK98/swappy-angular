import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './auth/auth.guard';
import { SelectComponent } from './select/select.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  {
    path: 'home',
    title: 'home page',
    component: HomeComponent,
    canActivate: [authGuard],
  },

  {
    path: 'register',
    title: 'signup',
    component: RegisterComponent,
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
    path: 'select',
    component: SelectComponent,
    canActivate: [authGuard],
  },

  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },

  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
