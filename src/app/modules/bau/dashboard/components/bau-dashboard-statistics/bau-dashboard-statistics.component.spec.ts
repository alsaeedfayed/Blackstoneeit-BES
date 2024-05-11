import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BauDashboardStatisticsComponent } from './bau-dashboard-statistics.component';

describe('BauDashboardStatisticsComponent', () => {
  let component: BauDashboardStatisticsComponent;
  let fixture: ComponentFixture<BauDashboardStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BauDashboardStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BauDashboardStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
