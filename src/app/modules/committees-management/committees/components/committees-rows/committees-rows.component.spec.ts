import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteesRowsComponent } from './committees-rows.component';

describe('CommitteesRowsComponent', () => {
  let component: CommitteesRowsComponent;
  let fixture: ComponentFixture<CommitteesRowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteesRowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteesRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
