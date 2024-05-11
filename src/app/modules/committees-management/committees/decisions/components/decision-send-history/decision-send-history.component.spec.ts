import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionSendHistoryComponent } from './decision-send-history.component';

describe('DecisionSendHistoryComponent', () => {
  let component: DecisionSendHistoryComponent;
  let fixture: ComponentFixture<DecisionSendHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecisionSendHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionSendHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
