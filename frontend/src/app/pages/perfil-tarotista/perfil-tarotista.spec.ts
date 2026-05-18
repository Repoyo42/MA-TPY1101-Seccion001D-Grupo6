import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilTarotista } from './perfil-tarotista';

describe('PerfilTarotista', () => {
  let component: PerfilTarotista;
  let fixture: ComponentFixture<PerfilTarotista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilTarotista],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilTarotista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
