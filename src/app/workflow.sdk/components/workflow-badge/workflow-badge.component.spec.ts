import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowBadgeComponent } from './workflow-badge.component';

describe('WorkflowBadgeComponent', () => {
  let component: WorkflowBadgeComponent;
  let fixture: ComponentFixture<WorkflowBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowBadgeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
