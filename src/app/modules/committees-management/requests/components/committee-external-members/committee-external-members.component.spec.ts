import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeExternalMembersComponent } from './committee-external-members.component';

describe('CommitteeExternalMembersComponent', () => {
  let component: CommitteeExternalMembersComponent;
  let fixture: ComponentFixture<CommitteeExternalMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeExternalMembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeExternalMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
