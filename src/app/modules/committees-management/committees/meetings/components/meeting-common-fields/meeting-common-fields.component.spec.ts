import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingCommonFieldsComponent } from './meeting-common-fields.component';

describe('MeetingCommonFieldsComponent', () => {
  let component: MeetingCommonFieldsComponent;
  let fixture: ComponentFixture<MeetingCommonFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingCommonFieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingCommonFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
