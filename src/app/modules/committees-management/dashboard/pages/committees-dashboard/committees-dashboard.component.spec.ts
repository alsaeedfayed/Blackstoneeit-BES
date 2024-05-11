import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteesDashboardComponent } from './committees-dashboard.component';

describe('CommitteesDashboardComponent', () => {
  let component: CommitteesDashboardComponent;
  let fixture: ComponentFixture<CommitteesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteesDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
