import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
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
    }
  }

  registrar() {
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

    this.loading = true;

    this.tarotistaService.crearTarotista(
      this.user.idUsuario,
      this.nombreProfesional.trim()
    ).subscribe({
      next: (res: any) => {
        this.success =
          res?.message || 'Tarotista creado correctamente';

        const tarotistaId =
          res?.data?.id ||
          res?.data?.tarotistaId ||
          res?.id ||
          null;

        if (tarotistaId) {
          localStorage.setItem('tarotistaId', String(tarotistaId));
        }

        setTimeout(() => {
          this.router.navigate(['/perfil-tarotista']);
        }, 1200);

        this.loading = false;
      },
      error: (err) => {
        this.error =
          err?.error?.message ||
          err?.error ||
          'No se pudo crear el perfil de tarotista';

        this.loading = false;
      }
    });
  }
}