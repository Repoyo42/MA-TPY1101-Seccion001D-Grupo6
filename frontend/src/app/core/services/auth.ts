import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  idUsuario: number;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth{

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(
    email: string,
    password: string
  ): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      {
        email,
        password
      }
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUser() {
    const user = localStorage.getItem('user');

    return user ? JSON.parse(user) : null;
  }

  register(
  nombre: string,
  email: string,
  password: string
  ) {

  return this.http.post(
    'http://localhost:8080/api/usuarios',
    {
      nombre,
      email,
      password
    }
  );
  }
}