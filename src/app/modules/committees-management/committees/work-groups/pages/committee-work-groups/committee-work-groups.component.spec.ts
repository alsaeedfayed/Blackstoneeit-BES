import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeWorkGroupsComponent } from './committee-work-groups.component';

describe('CommitteeWorkGroupsComponent', () => {
  let component: CommitteeWorkGroupsComponent;
  let fixture: ComponentFixture<CommitteeWorkGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeWorkGroupsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeWorkGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
