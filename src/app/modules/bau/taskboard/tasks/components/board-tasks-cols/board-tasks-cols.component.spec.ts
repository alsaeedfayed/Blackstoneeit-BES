import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardTasksColsComponent } from './board-tasks-cols.component';

describe('BoardTasksColsComponent', () => {
  let component: BoardTasksColsComponent;
  let fixture: ComponentFixture<BoardTasksColsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardTasksColsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardTasksColsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
