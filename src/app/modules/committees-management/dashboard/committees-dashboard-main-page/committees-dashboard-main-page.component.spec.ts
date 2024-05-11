import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteesDashboardMainPageComponent } from './committees-dashboard-main-page.component';

describe('CommitteesDashboardMainPageComponent', () => {
  let component: CommitteesDashboardMainPageComponent;
  let fixture: ComponentFixture<CommitteesDashboardMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteesDashboardMainPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteesDashboardMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
