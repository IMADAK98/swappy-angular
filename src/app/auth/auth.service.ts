import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, map } from 'rxjs';
import { customErrorHandler } from '../common/handleError';
import { environment } from '../../environments/environment.development';

export interface UserLogin {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  apiUrl = environment.apiUrl;

  signUp(user: UserLogin) {
    return this.http
      .post<any>(`${this.apiUrl}swappy-user-service/api/v1/auth/register`, user)
      .pipe(
        map((response) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            return true;
          }
          return false;
        }),
        catchError((err) => customErrorHandler(err)),
      );
  }

  logIn(user: UserLogin) {
    return this.http
      .post<any>(`${this.apiUrl}swappy-user-service/api/v1/auth/login`, user)
      .pipe(
        map((response) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            return true;
          }
          return false;
        }),
        catchError((err) => customErrorHandler(err)), // Correct placement of catchError
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/signup']);
  }

  //Todo add isLoggedIn method and isLoggedOut method based on token and backend
  public isLoggedIn(): boolean {
    let jwtHelper = new JwtHelperService();
    let token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    let expirationDate = jwtHelper.getTokenExpirationDate(token);
    let isExpired = jwtHelper.isTokenExpired(token);
    console.log(expirationDate, isExpired);

    return !isExpired;
  }

  get currentUser() {
    let token = localStorage.getItem('token');
    if (!token) return null;

    return new JwtHelperService().decodeToken(token);
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
