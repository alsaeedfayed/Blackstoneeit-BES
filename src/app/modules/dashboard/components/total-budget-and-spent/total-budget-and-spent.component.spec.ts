import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalBudgetAndSpentComponent } from './total-budget-and-spent.component';

describe('TotalBudgetAndSpentComponent', () => {
  let component: TotalBudgetAndSpentComponent;
  let fixture: ComponentFixture<TotalBudgetAndSpentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalBudgetAndSpentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalBudgetAndSpentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
