import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectStatesComponent } from './select-states.component';

describe('SelectStatesComponent', () => {
  let component: SelectStatesComponent;
  let fixture: ComponentFixture<SelectStatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectStatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectStatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
