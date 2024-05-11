import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTasksTableComponent } from './main-tasks-table.component';

describe('MainTasksTableComponent', () => {
  let component: MainTasksTableComponent;
  let fixture: ComponentFixture<MainTasksTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainTasksTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainTasksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
