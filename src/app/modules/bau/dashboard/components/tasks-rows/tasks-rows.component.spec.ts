import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksRowsComponent } from './tasks-rows.component';

describe('TasksRowsComponent', () => {
  let component: TasksRowsComponent;
  let fixture: ComponentFixture<TasksRowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksRowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
