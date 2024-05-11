import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BauDashboardFiltersComponent } from './bau-dashboard-filters.component';

describe('BauDashboardFiltersComponent', () => {
  let component: BauDashboardFiltersComponent;
  let fixture: ComponentFixture<BauDashboardFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BauDashboardFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BauDashboardFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
