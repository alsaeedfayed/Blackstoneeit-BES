import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrequencyInputComponent } from './frequency-input.component';

describe('FrequencyInputComponent', () => {
  let component: FrequencyInputComponent;
  let fixture: ComponentFixture<FrequencyInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrequencyInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrequencyInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
