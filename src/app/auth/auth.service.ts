import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
  PLATFORM_ID,
  afterNextRender,
} from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, map } from 'rxjs';
import { customErrorHandler } from '../errors/handleError';
import { environment } from '../../environments/environment.development';
import { UserLogin, UserSignup } from '../interfaces/auth.interfaces';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private localStorage: any;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private router: Router,
  ) {
    this.localStorage = isPlatformBrowser(this.platformId)
      ? window.localStorage
      : null;
  }

  apiUrl = environment.apiUrl;

  signUp(user: UserSignup) {
    return this.http
      .post<any>(
        `${this.apiUrl}/swappy-user-service/api/v1/auth/register`,
        user,
      )
      .pipe(
        map((response: any) => {
          if (response && response.token) {
            this.localStorage.setItem('token', response.token);
            return true;
          }
          return false;
        }),
        catchError((err) => customErrorHandler(err)),
      );
  }

  logIn(user: UserLogin) {
    return this.http
      .post<any>(
        `http://localhost:8765/swappy-user-service/api/v1/auth/login`,
        user,
      )
      .pipe(
        map((response) => {
          if (response && response.token) {
            this.localStorage.setItem('token', response.token);
            return true;
          }
          return false;
        }),
        catchError((err) => customErrorHandler(err)), // Correct placement of catchError
      );
  }

  logout() {
    this.localStorage.removeItem('token');
    this.router.navigateByUrl('/home');
  }

  //Todo add isLoggedIn method and isLoggedOut method based on token and backend
  // public isLoggedIn(): boolean {
  //   let jwtHelper = new JwtHelperService();

  //   let token = this.localStorage.getItem('token');
  //   if (!token) {
  //     return false;
  //   }
  //   let expirationDate = jwtHelper.getTokenExpirationDate(token);
  //   let isExpired = jwtHelper.isTokenExpired(token);
  //   console.log(expirationDate, isExpired);

  //   return !isExpired;
  // }

  // get currentUser() {
  //   let token = this.localStorage.getItem('token');
  //   if (!token) return null;

  //   return new JwtHelperService().decodeToken(token);
  // }

  public isLoggedIn(): boolean {
    let jwtHelper = new JwtHelperService();
    let token: string | null = null;

    if (this.localStorage) {
      token = this.localStorage.getItem('token');
    }

    if (!token) {
      return false;
    }

    let expirationDate = jwtHelper.getTokenExpirationDate(token);
    let isExpired = jwtHelper.isTokenExpired(token);
    return !isExpired;
  }

  // isLoggedOut() {
  //     return !this.isLoggedIn();
  // }

  // getExpiration() {
  //     const expiration = localStorage.getItem("expires_at");
  //     const expiresAt = JSON.parse(expiration);
  //     return moment(expiresAt);
  // }

  // private setSession(authResult) {
  //   const expiresAt = moment().add(authResult.expiresIn,'second');

  //   localStorage.setItem('id_token', authResult.idToken);
  //   localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
  // }
}
