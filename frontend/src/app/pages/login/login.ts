import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  email = '';
  password = '';
  error = '';

  showPassword = false;

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {

    this.error = '';

    this.authService.login(
      this.email,
      this.password
    ).subscribe({

      next: (res: any) => {

        localStorage.setItem('token', res.token);

        localStorage.setItem(
          'user',
          JSON.stringify(res)
        );

        const rol = res.rol;

        if (rol === 'CLIENTE') {

          this.router.navigate(['/cliente']);

        } else if (rol === 'ADMIN') {

          this.router.navigate(['/admin']);

        } else if (rol === 'TAROTISTA') {

          this.router.navigate(['/tarotista']);

        } else {

          this.router.navigate(['/']);
        }
      },

      error: (err) => {

        this.error =
          err?.error?.message ||
          'Credenciales incorrectas';
      }
    });
  }
}