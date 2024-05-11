import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpFiltersComponent } from './follow-up-filters.component';

describe('FollowUpFiltersComponent', () => {
  let component: FollowUpFiltersComponent;
  let fixture: ComponentFixture<FollowUpFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowUpFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowUpFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
