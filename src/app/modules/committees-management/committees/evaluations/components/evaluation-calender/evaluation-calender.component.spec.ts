import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationCalenderComponent } from './evaluation-calender.component';

describe('EvaluationCalenderComponent', () => {
  let component: EvaluationCalenderComponent;
  let fixture: ComponentFixture<EvaluationCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationCalenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
