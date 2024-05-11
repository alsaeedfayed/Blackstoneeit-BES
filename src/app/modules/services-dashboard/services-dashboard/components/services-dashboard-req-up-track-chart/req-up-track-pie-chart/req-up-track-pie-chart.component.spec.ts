import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqUpTrackPieChartComponent } from './req-up-track-pie-chart.component';

describe('ReqUpTrackPieChartComponent', () => {
  let component: ReqUpTrackPieChartComponent;
  let fixture: ComponentFixture<ReqUpTrackPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReqUpTrackPieChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqUpTrackPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
