import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTasksFiltersComponent } from './main-tasks-filters.component';

describe('MainTasksFiltersComponent', () => {
  let component: MainTasksFiltersComponent;
  let fixture: ComponentFixture<MainTasksFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainTasksFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainTasksFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
