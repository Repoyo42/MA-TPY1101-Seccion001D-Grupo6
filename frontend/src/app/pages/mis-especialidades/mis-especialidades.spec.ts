import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisEspecialidades } from './mis-especialidades';

describe('MisEspecialidades', () => {
  let component: MisEspecialidades;
  let fixture: ComponentFixture<MisEspecialidades>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisEspecialidades],
    }).compileComponents();

    fixture = TestBed.createComponent(MisEspecialidades);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
