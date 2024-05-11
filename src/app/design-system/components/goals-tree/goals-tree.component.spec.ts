import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalsTreeComponent } from './goals-tree.component';

describe('GoalsTreeComponent', () => {
  let component: GoalsTreeComponent;
  let fixture: ComponentFixture<GoalsTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoalsTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalsTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
