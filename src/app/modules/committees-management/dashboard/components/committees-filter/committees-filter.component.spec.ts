import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteesFilterComponent } from './committees-filter.component';

describe('CommitteesFilterComponent', () => {
  let component: CommitteesFilterComponent;
  let fixture: ComponentFixture<CommitteesFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteesFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
