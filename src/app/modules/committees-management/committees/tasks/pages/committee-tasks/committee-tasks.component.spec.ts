import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeTasksComponent } from './committee-tasks.component';

describe('CommitteeTasksComponent', () => {
  let component: CommitteeTasksComponent;
  let fixture: ComponentFixture<CommitteeTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeTasksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
