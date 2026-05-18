import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TarotistaService {

  private apiUrl = 'http://localhost:8080/api/tarotistas';

  constructor(private http: HttpClient) {}

  crearTarotista(
    usuarioId: number,
    nombreProfesional: string
  ): Observable<any> {

    return this.http.post<any>(this.apiUrl, {
      usuarioId,
      nombreProfesional
    });
  }

  actualizarPerfil(
    tarotistaId: number,
    descripcion: string,
    precioBase: number
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${tarotistaId}/perfil`,
      {
        descripcion,
        precioBase
      }
    );
  }
}