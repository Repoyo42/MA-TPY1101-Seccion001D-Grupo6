import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tarotista } from './tarotista';

describe('Tarotista', () => {
  let component: Tarotista;
  let fixture: ComponentFixture<Tarotista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tarotista],
    }).compileComponents();

    fixture = TestBed.createComponent(Tarotista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
