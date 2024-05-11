import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpPerQuarterComponent } from './follow-up-per-quarter.component';

describe('FollowUpPerQuarterComponent', () => {
  let component: FollowUpPerQuarterComponent;
  let fixture: ComponentFixture<FollowUpPerQuarterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowUpPerQuarterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowUpPerQuarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
