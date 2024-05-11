import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpClosureRatteComponent } from './follow-up-closure-ratte.component';

describe('FollowUpClosureRatteComponent', () => {
  let component: FollowUpClosureRatteComponent;
  let fixture: ComponentFixture<FollowUpClosureRatteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowUpClosureRatteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowUpClosureRatteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
