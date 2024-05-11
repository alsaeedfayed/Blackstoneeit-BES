import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpisPerformanceStatusComponent } from './kpis-performance-status.component';

describe('KpisPerformanceStatusComponent', () => {
  let component: KpisPerformanceStatusComponent;
  let fixture: ComponentFixture<KpisPerformanceStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpisPerformanceStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpisPerformanceStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
