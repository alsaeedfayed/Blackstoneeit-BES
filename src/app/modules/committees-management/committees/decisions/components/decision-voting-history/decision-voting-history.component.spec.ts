import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionVotingHistoryComponent } from './decision-voting-history.component';

describe('DecisionVotingHistoryComponent', () => {
  let component: DecisionVotingHistoryComponent;
  let fixture: ComponentFixture<DecisionVotingHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecisionVotingHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionVotingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
