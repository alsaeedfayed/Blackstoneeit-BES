import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendDecisionDetailsModelComponent } from './send-decision-details-model.component';

describe('SendDecisionDetailsModelComponent', () => {
  let component: SendDecisionDetailsModelComponent;
  let fixture: ComponentFixture<SendDecisionDetailsModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendDecisionDetailsModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendDecisionDetailsModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
