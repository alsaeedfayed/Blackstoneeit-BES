import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaFiledComponent } from './textarea-filed.component';

describe('TextareaFiledComponent', () => {
  let component: TextareaFiledComponent;
  let fixture: ComponentFixture<TextareaFiledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextareaFiledComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextareaFiledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
