import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDecisionModelComponent } from './create-decision-model.component';

describe('CreateDecisionModelComponent', () => {
  let component: CreateDecisionModelComponent;
  let fixture: ComponentFixture<CreateDecisionModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDecisionModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDecisionModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
