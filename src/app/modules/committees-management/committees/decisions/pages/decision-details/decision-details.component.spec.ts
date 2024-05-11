import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionDetailsComponent } from './decision-details.component';

describe('DecisionDetailsComponent', () => {
  let component: DecisionDetailsComponent;
  let fixture: ComponentFixture<DecisionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecisionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
