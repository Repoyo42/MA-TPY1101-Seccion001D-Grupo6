import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { RegistroCliente } from './pages/registro-cliente/registro-cliente';
import { RegistroTarotista } from './pages/registro-tarotista/registro-tarotista';
import { PerfilTarotista } from './pages/perfil-tarotista/perfil-tarotista';
import { Cliente } from './pages/cliente/cliente';

export const routes: Routes = [

  {
    path: '',
    component: Login
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'cliente',
    component: Cliente
  },

  {
    path: 'registro-cliente',
    component: RegistroCliente
  },

  {
    path: 'registro-tarotista',
    component: RegistroTarotista
  },

  {
    path: 'perfil-tarotista',
    component: PerfilTarotista
  }

];