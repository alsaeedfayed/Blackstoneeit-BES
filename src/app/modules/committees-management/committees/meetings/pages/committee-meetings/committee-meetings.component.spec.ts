import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeMeetingsComponent } from './committee-meetings.component';

describe('CommitteeMeetingsComponent', () => {
  let component: CommitteeMeetingsComponent;
  let fixture: ComponentFixture<CommitteeMeetingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeMeetingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeMeetingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
