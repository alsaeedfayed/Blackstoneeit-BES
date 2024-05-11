import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionsRowsComponent } from './decisions-rows.component';

describe('DecisionsRowsComponent', () => {
  let component: DecisionsRowsComponent;
  let fixture: ComponentFixture<DecisionsRowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecisionsRowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionsRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
