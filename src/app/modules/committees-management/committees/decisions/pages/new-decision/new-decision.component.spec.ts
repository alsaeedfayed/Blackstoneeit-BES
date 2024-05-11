import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDecisionComponent } from './new-decision.component';

describe('NewDecisionComponent', () => {
  let component: NewDecisionComponent;
  let fixture: ComponentFixture<NewDecisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewDecisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
