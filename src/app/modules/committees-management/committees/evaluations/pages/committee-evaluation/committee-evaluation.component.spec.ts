import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeEvaluationComponent } from './committee-evaluation.component';

describe('CommitteeAuditComponent', () => {
  let component: CommitteeEvaluationComponent;
  let fixture: ComponentFixture<CommitteeEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeEvaluationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
