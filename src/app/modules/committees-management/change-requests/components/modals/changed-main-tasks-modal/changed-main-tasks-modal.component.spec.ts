import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangedMainTasksModalComponent } from './changed-main-tasks-modal.component';

describe('ChangedMainTasksModalComponent', () => {
  let component: ChangedMainTasksModalComponent;
  let fixture: ComponentFixture<ChangedMainTasksModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangedMainTasksModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangedMainTasksModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
