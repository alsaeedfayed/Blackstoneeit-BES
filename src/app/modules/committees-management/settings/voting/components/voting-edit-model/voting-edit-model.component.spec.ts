import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingEditModelComponent } from './voting-edit-model.component';

describe('VotingEditModelComponent', () => {
  let component: VotingEditModelComponent;
  let fixture: ComponentFixture<VotingEditModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotingEditModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingEditModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
