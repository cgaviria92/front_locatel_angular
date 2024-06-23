import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabeceraVentasComponent } from './cabecera-ventas.component';

describe('CabeceraVentasComponent', () => {
  let component: CabeceraVentasComponent;
  let fixture: ComponentFixture<CabeceraVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CabeceraVentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabeceraVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
