import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationFilterComponent } from './evaluation-filter.component';

describe('EvaluationFilterComponent', () => {
  let component: EvaluationFilterComponent;
  let fixture: ComponentFixture<EvaluationFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
