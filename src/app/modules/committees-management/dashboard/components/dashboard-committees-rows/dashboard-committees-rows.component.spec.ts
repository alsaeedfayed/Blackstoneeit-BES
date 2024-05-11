import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCommitteesRowsComponent } from './dashboard-committees-rows.component';

describe('DashboardCommitteesRowsComponent', () => {
  let component: DashboardCommitteesRowsComponent;
  let fixture: ComponentFixture<DashboardCommitteesRowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardCommitteesRowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardCommitteesRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
