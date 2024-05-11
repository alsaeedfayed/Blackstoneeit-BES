import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingPieChartComponent } from './tracking-pie-chart.component';

describe('TrackingPieChartComponent', () => {
  let component: TrackingPieChartComponent;
  let fixture: ComponentFixture<TrackingPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingPieChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
