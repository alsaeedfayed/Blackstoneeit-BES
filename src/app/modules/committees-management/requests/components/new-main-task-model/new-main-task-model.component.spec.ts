import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMainTaskModelComponent } from './new-main-task-model.component';

describe('NewMainTaskModelComponent', () => {
  let component: NewMainTaskModelComponent;
  let fixture: ComponentFixture<NewMainTaskModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewMainTaskModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMainTaskModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
