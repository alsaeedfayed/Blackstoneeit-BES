import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingTimelineComponent } from './meeting-timeline.component';

describe('MeetingTimelineComponent', () => {
  let component: MeetingTimelineComponent;
  let fixture: ComponentFixture<MeetingTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingTimelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
