import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { RegistroCliente } from './pages/registro-cliente/registro-cliente';
import { RegistroTarotista } from './pages/registro-tarotista/registro-tarotista';
import { Cliente } from './pages/cliente/cliente';
import { MisEspecialidades } from './pages/mis-especialidades/mis-especialidades';
import { Tarotista } from './pages/tarotista/tarotista';

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
  path: 'mis-especialidades',
  component: MisEspecialidades
  },
  {
  path: 'tarotista',
  component: Tarotista
  }

];