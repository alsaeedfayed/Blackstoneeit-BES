import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTasksStatusComponent } from './main-tasks-status.component';

describe('MainTasksStatusComponent', () => {
  let component: MainTasksStatusComponent;
  let fixture: ComponentFixture<MainTasksStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainTasksStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainTasksStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
