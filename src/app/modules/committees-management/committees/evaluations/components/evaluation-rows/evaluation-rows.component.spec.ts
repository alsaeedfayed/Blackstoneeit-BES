import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationRowsComponent } from './evaluation-rows.component';

describe('EvaluationRowsComponent', () => {
  let component: EvaluationRowsComponent;
  let fixture: ComponentFixture<EvaluationRowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationRowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
