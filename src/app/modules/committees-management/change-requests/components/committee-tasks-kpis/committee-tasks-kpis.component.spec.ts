import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeTasksKpisComponent } from './committee-tasks-kpis.component';

describe('CommitteeTasksKpisComponent', () => {
  let component: CommitteeTasksKpisComponent;
  let fixture: ComponentFixture<CommitteeTasksKpisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeTasksKpisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeTasksKpisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
