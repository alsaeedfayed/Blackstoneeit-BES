import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionsTabComponent } from './decisions-tab.component';

describe('DecisionsTabComponent', () => {
  let component: DecisionsTabComponent;
  let fixture: ComponentFixture<DecisionsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecisionsTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
