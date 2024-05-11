import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMainTaskComponent } from './create-main-task.component';

describe('CreateMainTaskComponent', () => {
  let component: CreateMainTaskComponent;
  let fixture: ComponentFixture<CreateMainTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMainTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMainTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
