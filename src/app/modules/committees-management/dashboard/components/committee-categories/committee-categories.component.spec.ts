import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeCategoriesComponent } from './committee-categories.component';

describe('CommitteeCategoriesComponent', () => {
  let component: CommitteeCategoriesComponent;
  let fixture: ComponentFixture<CommitteeCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeCategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
