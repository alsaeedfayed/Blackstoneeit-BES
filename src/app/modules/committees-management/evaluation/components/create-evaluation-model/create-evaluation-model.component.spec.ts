import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEvaluationModelComponent } from './create-evaluation-model.component';

describe('CreateEvaluationModelComponent', () => {
  let component: CreateEvaluationModelComponent;
  let fixture: ComponentFixture<CreateEvaluationModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEvaluationModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEvaluationModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
