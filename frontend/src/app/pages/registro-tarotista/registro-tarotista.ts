import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TarotistaService } from '../../core/services/tarotista';

@Component({
  selector: 'app-registro-tarotista',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro-tarotista.html',
  styleUrls: ['./registro-tarotista.scss']
})
export class RegistroTarotista implements OnInit {

  nombreProfesional = '';
  descripcion = '';
  precioBase: number | null = null;

  error = '';
  success = '';
  loading = false;

  user: any = null;

  constructor(
    private tarotistaService: TarotistaService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const rawUser = localStorage.getItem('user');

    if (rawUser) {
      this.user = JSON.parse(rawUser);
    } else {
      this.error = 'Debes iniciar sesión para crear tu perfil de tarotista';
      this.router.navigate(['/login']);
    }
  }

  registrar(): void {
    this.error = '';
    this.success = '';

    if (!this.user) {
      this.error = 'Debes iniciar sesión primero';
      return;
    }

    if (this.nombreProfesional.trim().length < 3) {
      this.error = 'El nombre profesional debe tener al menos 3 caracteres';
      return;
    }

    if (this.descripcion.trim().length < 20) {
      this.error = 'La descripción debe tener al menos 20 caracteres';
      return;
    }

    if (this.descripcion.trim().length > 500) {
      this.error = 'La descripción no puede superar los 500 caracteres';
      return;
    }

    if (this.precioBase === null || this.precioBase <= 0) {
      this.error = 'El precio base debe ser mayor a 0';
      return;
    }

    this.loading = true;

    this.tarotistaService.crearTarotista(
      this.user.idUsuario,
      this.nombreProfesional.trim()
    ).subscribe({
      next: (res: any) => {
        const tarotistaId =
          res?.data?.id ||
          res?.data?.tarotistaId ||
          res?.id ||
          null;

        if (!tarotistaId) {
          this.loading = false;
          this.error = 'Se creó el tarotista, pero no se pudo obtener su ID';
          return;
        }

        localStorage.setItem('tarotistaId', String(tarotistaId));

        this.tarotistaService.actualizarPerfil(
          tarotistaId,
          this.descripcion.trim(),
          this.precioBase as number
        ).subscribe({
          next: (updateRes: any) => {
            this.success =
              updateRes?.message || 'Perfil de tarotista creado correctamente';

            setTimeout(() => {
              this.router.navigate(['/mis-especialidades']);
            }, 1200);

            this.loading = false;
          },
          error: (err: any) => {
            this.error =
              err?.error?.message ||
              err?.error ||
              'No se pudo guardar el perfil profesional';

            this.loading = false;
          }
        });
      },
      error: (err: any) => {
        this.error =
          err?.error?.message ||
          err?.error ||
          'No se pudo crear el perfil de tarotista';

        this.loading = false;
      }
    });
  }
}