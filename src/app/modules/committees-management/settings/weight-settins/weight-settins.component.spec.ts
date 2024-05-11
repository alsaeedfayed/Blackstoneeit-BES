import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightSettinsComponent } from './weight-settins.component';

describe('WeightSettinsComponent', () => {
  let component: WeightSettinsComponent;
  let fixture: ComponentFixture<WeightSettinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeightSettinsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightSettinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
