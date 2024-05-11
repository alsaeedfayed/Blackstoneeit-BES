import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesDashboardFiltersComponent } from './services-dashboard-filters.component';

describe('ServicesDashboardFiltersComponent', () => {
  let component: ServicesDashboardFiltersComponent;
  let fixture: ComponentFixture<ServicesDashboardFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicesDashboardFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesDashboardFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
