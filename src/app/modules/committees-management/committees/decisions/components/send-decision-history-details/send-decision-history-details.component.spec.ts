import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendDecisionHistoryDetailsComponent } from './send-decision-history-details.component';

describe('SendDecisionHistoryDetailsComponent', () => {
  let component: SendDecisionHistoryDetailsComponent;
  let fixture: ComponentFixture<SendDecisionHistoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendDecisionHistoryDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendDecisionHistoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
