import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMomMeetingComponent } from './edit-mom-meeting.component';

describe('EditMomMeetingComponent', () => {
  let component: EditMomMeetingComponent;
  let fixture: ComponentFixture<EditMomMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMomMeetingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMomMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
