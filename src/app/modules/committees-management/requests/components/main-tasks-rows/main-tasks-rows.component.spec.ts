import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTasksRowsComponent } from './main-tasks-rows.component';

describe('MainTasksRowsComponent', () => {
  let component: MainTasksRowsComponent;
  let fixture: ComponentFixture<MainTasksRowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainTasksRowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainTasksRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
