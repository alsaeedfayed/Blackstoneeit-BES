import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionDetailsModelComponent } from './decision-details-model.component';

describe('DecisionDetailsModelComponent', () => {
  let component: DecisionDetailsModelComponent;
  let fixture: ComponentFixture<DecisionDetailsModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecisionDetailsModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionDetailsModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
