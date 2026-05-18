import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-registro-cliente',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './registro-cliente.html',
  styleUrls: ['./registro-cliente.scss']
})
export class RegistroCliente {

  nombre = '';
  email = '';
  password = '';

  error = '';
  success = '';

  showPassword = false;

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  register() {

    this.error = '';
    this.success = '';

    if (this.password.length < 8) {
      this.error =
        'La contraseña debe tener al menos 8 caracteres';
      return;
    }

    this.authService.register(
      this.nombre,
      this.email,
      this.password
    ).subscribe({

      next: () => {

        this.success =
          'Usuario registrado correctamente';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },

      error: (err: any) => {

        this.error =
          err?.error ||
          'Error al registrar usuario';
      }
    });
  }
}