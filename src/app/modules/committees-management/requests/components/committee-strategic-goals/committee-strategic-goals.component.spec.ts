import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeStrategicGoalsComponent } from './committee-strategic-goals.component';

describe('CommitteeStrategicGoalsComponent', () => {
  let component: CommitteeStrategicGoalsComponent;
  let fixture: ComponentFixture<CommitteeStrategicGoalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeStrategicGoalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeStrategicGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
