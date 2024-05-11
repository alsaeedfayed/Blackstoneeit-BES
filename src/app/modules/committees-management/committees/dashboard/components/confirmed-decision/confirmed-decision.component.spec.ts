import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmedDecisionComponent } from './confirmed-decision.component';

describe('ConfirmedDecisionComponent', () => {
  let component: ConfirmedDecisionComponent;
  let fixture: ComponentFixture<ConfirmedDecisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmedDecisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmedDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
