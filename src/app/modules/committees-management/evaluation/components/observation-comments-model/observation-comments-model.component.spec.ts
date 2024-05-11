import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationCommentsModelComponent } from './observation-comments-model.component';

describe('ObservationCommentsModelComponent', () => {
  let component: ObservationCommentsModelComponent;
  let fixture: ComponentFixture<ObservationCommentsModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObservationCommentsModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationCommentsModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
