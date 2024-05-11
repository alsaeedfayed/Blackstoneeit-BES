import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesDashboardSlaComponent } from './services-dashboard-sla.component';

describe('ServicesDashboardSlaComponent', () => {
  let component: ServicesDashboardSlaComponent;
  let fixture: ComponentFixture<ServicesDashboardSlaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicesDashboardSlaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesDashboardSlaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
