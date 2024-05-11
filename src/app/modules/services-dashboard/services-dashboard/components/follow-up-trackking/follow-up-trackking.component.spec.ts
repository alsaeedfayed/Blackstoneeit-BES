import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpTrackkingComponent } from './follow-up-trackking.component';

describe('FollowUpTrackkingComponent', () => {
  let component: FollowUpTrackkingComponent;
  let fixture: ComponentFixture<FollowUpTrackkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowUpTrackkingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowUpTrackkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
