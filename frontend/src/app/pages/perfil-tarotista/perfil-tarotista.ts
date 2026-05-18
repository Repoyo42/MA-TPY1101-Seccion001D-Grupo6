import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TarotistaService } from '../../core/services/tarotista';

@Component({
  selector: 'app-perfil-tarotista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-tarotista.html',
  styleUrls: ['./perfil-tarotista.scss']
})
export class PerfilTarotista implements OnInit {

  descripcion = '';
  precioBase: number | null = null;

  error = '';
  success = '';
  loading = false;

  user: any = null;
  tarotistaId: number | null = null;

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
    const rawTarotistaId = localStorage.getItem('tarotistaId');

    if (rawUser) {
      this.user = JSON.parse(rawUser);
    }

    if (rawTarotistaId) {
      this.tarotistaId = Number(rawTarotistaId);
    }

    if (!this.user) {
      this.router.navigate(['/login']);
    }

    if (!this.tarotistaId) {
      this.error = 'No se encontró el perfil de tarotista. Debes crear primero el perfil básico.';
    }
  }

  guardarPerfil() {
    this.error = '';
    this.success = '';

    if (!this.tarotistaId) {
      this.error = 'No se encontró el ID del tarotista';
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

    this.tarotistaService.actualizarPerfil(
      this.tarotistaId,
      this.descripcion.trim(),
      this.precioBase
    ).subscribe({
      next: (res: any) => {
        this.success =
          res?.message || 'Perfil profesional guardado correctamente';

        setTimeout(() => {
          this.router.navigate(['/cliente']);
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
  }
}