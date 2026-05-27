import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import {
  Especialidad,
  EspecialidadService
} from '../../core/services/especialidad';

@Component({
  selector: 'app-mis-especialidades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-especialidades.html',
  styleUrls: ['./mis-especialidades.scss']
})
export class MisEspecialidades implements OnInit {

  user: any = null;
  tarotistaId: number | null = null;

  especialidades: Especialidad[] = [];

  seleccionadas = new Set<number>();
  seleccionInicial = new Set<number>();

  cargando = false;
  guardando = false;

  error = '';
  success = '';

  constructor(
    private especialidadService: EspecialidadService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {

    if (!isPlatformBrowser(this.platformId)) return;

    const rawUser = localStorage.getItem('user');
    const rawTarotistaId = localStorage.getItem('tarotistaId');

    if (!rawUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.user = JSON.parse(rawUser);

    if (!rawTarotistaId) {
      this.router.navigate(['/registro-tarotista']);
      return;
    }

    this.tarotistaId = Number(rawTarotistaId);

    this.cargarEspecialidades();
  }

  cargarEspecialidades(): void {

    if (!this.tarotistaId) return;

    this.cargando = true;
    this.error = '';
    this.success = '';

    this.especialidadService.obtenerEspecialidades()
      .subscribe({
        next: (res) => {

          console.log('CATALOGO:', res);

          setTimeout(() => {
            this.especialidades = res.data || [];
            this.cargando = false;
            this.cdr.detectChanges();
          });

          this.cargarEspecialidadesSeleccionadas();
        },

        error: (err) => {
          console.error(err);

          this.error =
            err?.error?.message ||
            'Error cargando especialidades';

          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
  }

  cargarEspecialidadesSeleccionadas(): void {

    if (!this.tarotistaId) return;

    this.especialidadService
      .obtenerEspecialidadesDelTarotista(this.tarotistaId)
      .subscribe({
        next: (res) => {

          console.log('ASIGNADAS:', res);

          const ids = (res.data || [])
            .map(item => Number(item.especialidadId));

          this.seleccionadas = new Set(ids);
          this.seleccionInicial = new Set(ids);

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error(err);
          this.cdr.detectChanges();
        }
      });
  }

  estaSeleccionada(id: number): boolean {
    return this.seleccionadas.has(id);
  }

  cambiarSeleccion(id: number, checked: boolean): void {
    checked
      ? this.seleccionadas.add(id)
      : this.seleccionadas.delete(id);
  }

  guardarCambios(): void {

    this.error = '';
    this.success = '';

    if (!this.tarotistaId) return;

    if (this.seleccionadas.size < 1) {
      this.error = 'Debes seleccionar al menos una especialidad';
      return;
    }

    const agregar = [...this.seleccionadas]
      .filter(id => !this.seleccionInicial.has(id));

    const eliminar = [...this.seleccionInicial]
      .filter(id => !this.seleccionadas.has(id));

    if (!agregar.length && !eliminar.length) {
      this.success = 'No hay cambios para guardar';
      return;
    }

    this.guardando = true;

    const peticiones: Observable<any>[] = [];

    agregar.forEach(id =>
      peticiones.push(
        this.especialidadService.agregarEspecialidad(this.tarotistaId!, id)
      )
    );

    eliminar.forEach(id =>
      peticiones.push(
        this.especialidadService.eliminarEspecialidad(this.tarotistaId!, id)
      )
    );

    this.ejecutarSecuencial(peticiones);
  }

  ejecutarSecuencial(peticiones: Observable<any>[]): void {

    const ejecutar = (index: number) => {

      if (index >= peticiones.length) {

        this.guardando = false;
        this.success = 'Especialidades guardadas correctamente';

        this.seleccionInicial = new Set(this.seleccionadas);

        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/tarotista']);
        }, 1200);

        return;
      }

      peticiones[index].subscribe({
        next: () => ejecutar(index + 1),
        error: (err) => {

          console.error(err);

          this.guardando = false;
          this.error =
            err?.error?.message ||
            'Error guardando cambios';

          this.cdr.detectChanges();
        }
      });
    };

    ejecutar(0);
  }
}