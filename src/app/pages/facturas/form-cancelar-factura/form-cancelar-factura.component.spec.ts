import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCancelarFacturaComponent } from './form-cancelar-factura.component';

describe('FormCancelarFacturaComponent', () => {
  let component: FormCancelarFacturaComponent;
  let fixture: ComponentFixture<FormCancelarFacturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCancelarFacturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCancelarFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
