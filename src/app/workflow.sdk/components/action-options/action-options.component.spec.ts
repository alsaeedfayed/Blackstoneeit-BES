import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionOptionsComponent } from './action-options.component';

describe('ActionOptionsComponent', () => {
  let component: ActionOptionsComponent;
  let fixture: ComponentFixture<ActionOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
