import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingsRowsComponent } from './meetings-rows.component';

describe('MeetingsRowsComponent', () => {
  let component: MeetingsRowsComponent;
  let fixture: ComponentFixture<MeetingsRowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingsRowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingsRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
