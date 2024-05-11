import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeDecisionInfoComponent } from './committee-decision-info.component';

describe('CommitteeDecisionInfoComponent', () => {
  let component: CommitteeDecisionInfoComponent;
  let fixture: ComponentFixture<CommitteeDecisionInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeDecisionInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeDecisionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
