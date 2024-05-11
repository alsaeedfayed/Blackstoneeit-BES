import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTaskProgressModalComponent } from './update-task-progress-modal.component';

describe('UpdateTaskProgressModalComponent', () => {
  let component: UpdateTaskProgressModalComponent;
  let fixture: ComponentFixture<UpdateTaskProgressModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTaskProgressModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTaskProgressModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
