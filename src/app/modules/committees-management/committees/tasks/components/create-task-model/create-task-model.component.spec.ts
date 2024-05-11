import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTaskModelComponent } from './create-task-model.component';

describe('CreateTaskModelComponent', () => {
  let component: CreateTaskModelComponent;
  let fixture: ComponentFixture<CreateTaskModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTaskModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTaskModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
