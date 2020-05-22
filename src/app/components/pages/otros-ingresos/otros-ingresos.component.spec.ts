import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtrosIngresosComponent } from './otros-ingresos.component';

describe('OtrosIngresosComponent', () => {
  let component: OtrosIngresosComponent;
  let fixture: ComponentFixture<OtrosIngresosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtrosIngresosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtrosIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
