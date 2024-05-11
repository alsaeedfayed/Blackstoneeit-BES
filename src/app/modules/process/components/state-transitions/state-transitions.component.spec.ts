import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateTransitionsComponent } from './state-transitions.component';

describe('StateTransitionsComponent', () => {
  let component: StateTransitionsComponent;
  let fixture: ComponentFixture<StateTransitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StateTransitionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StateTransitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
