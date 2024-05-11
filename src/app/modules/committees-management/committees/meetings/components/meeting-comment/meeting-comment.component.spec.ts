import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingCommentComponent } from './meeting-comment.component';

describe('MeetingCommentComponent', () => {
  let component: MeetingCommentComponent;
  let fixture: ComponentFixture<MeetingCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
