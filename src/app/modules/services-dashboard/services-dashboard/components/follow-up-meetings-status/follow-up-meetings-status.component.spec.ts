import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpMeetingsStatusComponent } from './follow-up-meetings-status.component';

describe('FollowUpMeetingsStatusComponent', () => {
  let component: FollowUpMeetingsStatusComponent;
  let fixture: ComponentFixture<FollowUpMeetingsStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowUpMeetingsStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowUpMeetingsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
