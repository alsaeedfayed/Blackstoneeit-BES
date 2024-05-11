import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingBarComponent } from './voting-bar.component';

describe('VotingBarComponent', () => {
  let component: VotingBarComponent;
  let fixture: ComponentFixture<VotingBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotingBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
