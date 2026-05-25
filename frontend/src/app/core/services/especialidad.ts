import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Especialidad {
  id: number;
  nombre: string;
  descripcion?: string;
  activa?: boolean;
}

export interface TarotistaEspecialidadResponse {
  id: number;
  especialidadId: number;
  nombre: string;
  descripcion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  obtenerEspecialidades(): Observable<ApiResponse<Especialidad[]>> {
    return this.http.get<ApiResponse<Especialidad[]>>(
      `${this.apiUrl}/especialidades`
    );
  }

  obtenerEspecialidadesDelTarotista(
    tarotistaId: number
  ): Observable<ApiResponse<TarotistaEspecialidadResponse[]>> {
    return this.http.get<ApiResponse<TarotistaEspecialidadResponse[]>>(
      `${this.apiUrl}/tarotistas/${tarotistaId}/especialidades`
    );
  }

  agregarEspecialidad(
    tarotistaId: number,
    especialidadId: number
  ): Observable<ApiResponse<TarotistaEspecialidadResponse>> {
    return this.http.post<ApiResponse<TarotistaEspecialidadResponse>>(
      `${this.apiUrl}/tarotistas/${tarotistaId}/especialidades`,
      { especialidadId }
    );
  }

  eliminarEspecialidad(
    tarotistaId: number,
    especialidadId: number
  ): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(
      `${this.apiUrl}/tarotistas/${tarotistaId}/especialidades/${especialidadId}`
    );
  }
}