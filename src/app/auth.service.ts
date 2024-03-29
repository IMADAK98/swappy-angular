import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }


  login(firstName:string, lastName:string ,  email:string , password:string){
    return this.http.post<any>('http://localhost:8000/api/v1/auth/register',{})
  }
}
