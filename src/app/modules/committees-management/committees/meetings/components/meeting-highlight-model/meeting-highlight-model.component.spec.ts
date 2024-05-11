import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingHighlightModelComponent } from './meeting-highlight-model.component';

describe('MeetingHighlightModelComponent', () => {
  let component: MeetingHighlightModelComponent;
  let fixture: ComponentFixture<MeetingHighlightModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingHighlightModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingHighlightModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
