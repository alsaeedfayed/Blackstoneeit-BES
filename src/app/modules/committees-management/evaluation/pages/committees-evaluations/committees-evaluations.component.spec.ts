import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteesEvaluationsComponent } from './committees-evaluations.component';

describe('CommitteesEvaluationsComponent', () => {
  let component: CommitteesEvaluationsComponent;
  let fixture: ComponentFixture<CommitteesEvaluationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteesEvaluationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteesEvaluationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
