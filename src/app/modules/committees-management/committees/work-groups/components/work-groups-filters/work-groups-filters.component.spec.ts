import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkGroupsFiltersComponent } from './work-groups-filters.component';

describe('WorkGroupsFiltersComponent', () => {
  let component: WorkGroupsFiltersComponent;
  let fixture: ComponentFixture<WorkGroupsFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkGroupsFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkGroupsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
