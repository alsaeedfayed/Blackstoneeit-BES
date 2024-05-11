import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeMembersColumnComponent } from './committee-members-column.component';

describe('CommitteeMembersColumnComponent', () => {
  let component: CommitteeMembersColumnComponent;
  let fixture: ComponentFixture<CommitteeMembersColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeMembersColumnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeMembersColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
