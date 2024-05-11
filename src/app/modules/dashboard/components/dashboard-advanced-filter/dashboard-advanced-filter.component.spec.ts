import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAdvancedFilterComponent } from './dashboard-advanced-filter.component';

describe('DashboardAdvancedFilterComponent', () => {
  let component: DashboardAdvancedFilterComponent;
  let fixture: ComponentFixture<DashboardAdvancedFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardAdvancedFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAdvancedFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
