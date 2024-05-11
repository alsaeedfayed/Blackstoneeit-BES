import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberRangePickerComponent } from './number-range-picker.component';

describe('NumberRangePickerComponent', () => {
  let component: NumberRangePickerComponent;
  let fixture: ComponentFixture<NumberRangePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumberRangePickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberRangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
