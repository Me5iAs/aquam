import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosDeliveryComponent } from './pedidos-delivery.component';

describe('PedidosDeliveryComponent', () => {
  let component: PedidosDeliveryComponent;
  let fixture: ComponentFixture<PedidosDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
