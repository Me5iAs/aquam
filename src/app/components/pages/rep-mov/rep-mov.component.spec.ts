import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepMovComponent } from './rep-mov.component';

describe('RepMovComponent', () => {
  let component: RepMovComponent;
  let fixture: ComponentFixture<RepMovComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepMovComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepMovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
