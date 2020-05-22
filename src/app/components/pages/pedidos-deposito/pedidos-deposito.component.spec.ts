import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosDepositoComponent } from './pedidos-deposito.component';

describe('PedidosDepositoComponent', () => {
  let component: PedidosDepositoComponent;
  let fixture: ComponentFixture<PedidosDepositoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosDepositoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosDepositoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
