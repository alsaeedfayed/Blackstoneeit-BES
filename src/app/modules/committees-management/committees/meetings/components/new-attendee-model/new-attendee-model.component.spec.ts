import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAttendeeModelComponent } from './new-attendee-model.component';

describe('NewAttendeeModelComponent', () => {
  let component: NewAttendeeModelComponent;
  let fixture: ComponentFixture<NewAttendeeModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAttendeeModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAttendeeModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
