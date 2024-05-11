import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionVotingOptionsComponent } from './decision-voting-options.component';

describe('DecisionVotingOptionsComponent', () => {
  let component: DecisionVotingOptionsComponent;
  let fixture: ComponentFixture<DecisionVotingOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecisionVotingOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionVotingOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
