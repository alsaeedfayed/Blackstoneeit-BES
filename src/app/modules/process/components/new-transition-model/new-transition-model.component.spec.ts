import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTransitionModelComponent } from './new-transition-model.component';

describe('NewTransitionModelComponent', () => {
  let component: NewTransitionModelComponent;
  let fixture: ComponentFixture<NewTransitionModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTransitionModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTransitionModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
