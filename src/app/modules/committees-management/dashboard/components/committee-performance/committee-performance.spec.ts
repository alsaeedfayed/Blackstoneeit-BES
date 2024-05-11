import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceRateComponent } from './committee-performance';

describe('AttendanceRateComponent', () => {
  let component: AttendanceRateComponent;
  let fixture: ComponentFixture<AttendanceRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttendanceRateComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
