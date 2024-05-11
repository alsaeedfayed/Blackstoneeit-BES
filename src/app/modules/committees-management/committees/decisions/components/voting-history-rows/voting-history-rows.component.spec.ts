import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingHistoryRowsComponent } from './voting-history-rows.component';

describe('VotingHistoryRowsComponent', () => {
  let component: VotingHistoryRowsComponent;
  let fixture: ComponentFixture<VotingHistoryRowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotingHistoryRowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingHistoryRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
