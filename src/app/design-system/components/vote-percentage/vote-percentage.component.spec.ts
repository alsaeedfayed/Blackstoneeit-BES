import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotePercentageComponent } from './vote-percentage.component';

describe('VotePercentageComponent', () => {
  let component: VotePercentageComponent;
  let fixture: ComponentFixture<VotePercentageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotePercentageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VotePercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
