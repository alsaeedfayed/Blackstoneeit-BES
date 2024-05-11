import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerApprovalTasksComponent } from './manager-approval-tasks.component';

describe('ManagerApprovalTasksComponent', () => {
  let component: ManagerApprovalTasksComponent;
  let fixture: ComponentFixture<ManagerApprovalTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerApprovalTasksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerApprovalTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
