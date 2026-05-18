import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroTarotista } from './registro-tarotista';

describe('RegistroTarotista', () => {
  let component: RegistroTarotista;
  let fixture: ComponentFixture<RegistroTarotista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroTarotista],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroTarotista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
