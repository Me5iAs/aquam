import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GTablaComponent } from './g-tabla.component';

describe('GTablaComponent', () => {
  let component: GTablaComponent;
  let fixture: ComponentFixture<GTablaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GTablaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
