import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskboardFormModalComponent } from './taskboard-form-modal.component';

describe('TaskboardFormModalComponent', () => {
  let component: TaskboardFormModalComponent;
  let fixture: ComponentFixture<TaskboardFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskboardFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskboardFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
