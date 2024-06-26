import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationDetailsComponent } from './evaluation-details.component';

describe('AuditDetailsComponent', () => {
  let component: EvaluationDetailsComponent;
  let fixture: ComponentFixture<EvaluationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
