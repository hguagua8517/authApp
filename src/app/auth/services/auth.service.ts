import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from "rxjs/operators";
import { Observable, of } from 'rxjs';

import { environment } from 'src/environment/environment';

import { AuthResponse, Usuario } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _User!: Usuario;

  get usuario(){
    return { ...this._User};
  }

  constructor( private http: HttpClient) { }

  login(email: string, password: string){

     const url = `${this.baseUrl}/auth`;
     const body =  {email, password};

     this.http.post(url, body);
     return this.http.post<AuthResponse>(url, body)
     .pipe(
      //desestructurando la respuesta
      tap( ({ok, token}) => {
        if (ok ){
          //Comando para almacenar el JWT en el localSotrage
          localStorage.setItem('token', token!);
          //this._User = {
          //  name: resp.name!,
          //  uid: resp.uid!,
          //  email: resp.email!,
          //}
        }
      }),
      map( resp => resp.ok),
      catchError( err => of(err.error.msg)));
  }

  validarToken(): Observable<boolean> {

    const url = `${this.baseUrl}/auth/renew`;
    const headers = new HttpHeaders().set('x-token', localStorage.getItem('token') || '');
    return this.http.get<AuthResponse>(url, {headers}).pipe(
      map(resp => {
        console.log(resp.token);
        localStorage.setItem('token', resp.token!);
        this._User = {
          name: resp.name!,
          uid: resp.uid!,
          email: resp.email!,
        }
        return resp.ok
      }),
      catchError(err => of(false))
    );

  }

  register(name: string, email: string, password: string){
    const url = `${this.baseUrl}/auth/new`;
     const body =  {name, email, password};

     this.http.post(url, body);
     return this.http.post<AuthResponse>(url, body)
     .pipe(
      tap( resp => {
        if (resp.ok ){
          //Comando para almacenar el JWT en el localSotrage
          localStorage.setItem('token', resp.token!);
          //this._User = {
          //  name: resp.name!,
          //  uid: resp.uid!,
          //  email: resp.email!
          //}
        }
      }),
      map( resp => resp.ok),
      catchError( err => of(err.error.msg)));

  }

  logout(){
    localStorage.clear();
  }
}
