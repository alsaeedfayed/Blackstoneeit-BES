import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesDashboardRequestsComponent } from './services-dashboard-requests.component';

describe('ServicesDashboardRequestsComponent', () => {
  let component: ServicesDashboardRequestsComponent;
  let fixture: ComponentFixture<ServicesDashboardRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicesDashboardRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesDashboardRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
