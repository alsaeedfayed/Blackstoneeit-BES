import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailsModelComponent } from './task-details-model.component';

describe('TaskDetailsModelComponent', () => {
  let component: TaskDetailsModelComponent;
  let fixture: ComponentFixture<TaskDetailsModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskDetailsModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailsModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
