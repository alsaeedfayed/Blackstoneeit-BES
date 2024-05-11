import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeDecisionsComponent } from './committee-decisions.component';

describe('CommitteeDecisionsComponent', () => {
  let component: CommitteeDecisionsComponent;
  let fixture: ComponentFixture<CommitteeDecisionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeDecisionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeDecisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
