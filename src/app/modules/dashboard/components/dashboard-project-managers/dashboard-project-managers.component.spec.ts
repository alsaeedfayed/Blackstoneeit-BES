import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardProjectManagersComponent } from './dashboard-project-managers.component';

describe('DashboardProjectManagersComponent', () => {
  let component: DashboardProjectManagersComponent;
  let fixture: ComponentFixture<DashboardProjectManagersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardProjectManagersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardProjectManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
