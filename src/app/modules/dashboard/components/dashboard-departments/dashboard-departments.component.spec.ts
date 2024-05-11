import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDepartmentsComponent } from './dashboard-departments.component';

describe('DashboardDepartmentsComponent', () => {
  let component: DashboardDepartmentsComponent;
  let fixture: ComponentFixture<DashboardDepartmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardDepartmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
