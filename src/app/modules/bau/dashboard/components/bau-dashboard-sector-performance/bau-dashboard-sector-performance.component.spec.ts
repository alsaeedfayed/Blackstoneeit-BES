import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BauDashboardSectorPerformanceComponent } from './bau-dashboard-sector-performance.component';

describe('BauDashboardSectorPerformanceComponent', () => {
  let component: BauDashboardSectorPerformanceComponent;
  let fixture: ComponentFixture<BauDashboardSectorPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BauDashboardSectorPerformanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BauDashboardSectorPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
