import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesDashboardClosureRateComponent } from './services-dashboard-closure-rate.component';

describe('ServicesDashboardClosureRateComponent', () => {
  let component: ServicesDashboardClosureRateComponent;
  let fixture: ComponentFixture<ServicesDashboardClosureRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicesDashboardClosureRateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesDashboardClosureRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
