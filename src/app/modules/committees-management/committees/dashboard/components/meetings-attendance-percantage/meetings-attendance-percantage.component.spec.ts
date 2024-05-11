import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingsAttendancePercantageComponent } from './meetings-attendance-percantage.component';

describe('MeetingsAttendancePercantageComponent', () => {
  let component: MeetingsAttendancePercantageComponent;
  let fixture: ComponentFixture<MeetingsAttendancePercantageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingsAttendancePercantageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingsAttendancePercantageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
