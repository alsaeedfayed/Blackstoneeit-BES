import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesDashboardFollowupComponent } from './services-dashboard-followup.component';

describe('ServicesDashboardFollowupComponent', () => {
  let component: ServicesDashboardFollowupComponent;
  let fixture: ComponentFixture<ServicesDashboardFollowupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicesDashboardFollowupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesDashboardFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
