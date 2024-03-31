import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs';

export interface User {
  firstName: string;
  lastName: string;
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

  signUp(user: User) {
    return this.http
      .post<any>('http://localhost:8000/api/v1/auth/register', user)
      .pipe(
        map((response) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            return true;
          }
          return false;
        }),
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/register']);
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
