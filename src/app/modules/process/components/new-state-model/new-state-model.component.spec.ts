import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStateModelComponent } from './new-state-model.component';

describe('NewStateModelComponent', () => {
  let component: NewStateModelComponent;
  let fixture: ComponentFixture<NewStateModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewStateModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewStateModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
