import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilderBaseComponent } from './form-builder-base.component';

describe('FormBuilderBaseComponent', () => {
  let component: FormBuilderBaseComponent;
  let fixture: ComponentFixture<FormBuilderBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormBuilderBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormBuilderBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
