import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesDashboardReqUpTrackChartComponent } from './services-dashboard-req-up-track-chart.component';

describe('ServicesDashboardReqUpTrackChartComponent', () => {
  let component: ServicesDashboardReqUpTrackChartComponent;
  let fixture: ComponentFixture<ServicesDashboardReqUpTrackChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicesDashboardReqUpTrackChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesDashboardReqUpTrackChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
