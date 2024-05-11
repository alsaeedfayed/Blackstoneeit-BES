import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveAndCloseEvaluationModelComponent } from './approve-and-close-evaluation-model.component';

describe('ApproveAndCloseEvaluationModelComponent', () => {
  let component: ApproveAndCloseEvaluationModelComponent;
  let fixture: ComponentFixture<ApproveAndCloseEvaluationModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveAndCloseEvaluationModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveAndCloseEvaluationModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
