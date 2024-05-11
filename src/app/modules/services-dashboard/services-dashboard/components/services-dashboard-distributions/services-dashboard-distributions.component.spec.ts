import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesDashboardDistributionsComponent } from './services-dashboard-distributions.component';

describe('ServicesDashboardDistributionsComponent', () => {
  let component: ServicesDashboardDistributionsComponent;
  let fixture: ComponentFixture<ServicesDashboardDistributionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicesDashboardDistributionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesDashboardDistributionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
