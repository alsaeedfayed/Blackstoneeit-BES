import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewObservationModelComponent } from './new-observation-model.component';

describe('NewObservationModelComponent', () => {
  let component: NewObservationModelComponent;
  let fixture: ComponentFixture<NewObservationModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewObservationModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewObservationModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
