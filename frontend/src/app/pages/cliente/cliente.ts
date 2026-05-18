import {
Component,Inject,OnInit,PLATFORM_ID} from '@angular/core';

import {CommonModule,isPlatformBrowser} from '@angular/common';

import {Router,RouterLink} from '@angular/router';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './cliente.html',
  styleUrl: './cliente.scss',
})
export class Cliente implements OnInit {

  user: any = null;

  menuOpen = false;

  constructor(
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

      this.router.navigate(['/login']);
    }
  }

  logout() {

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.router.navigate(['/login']);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}