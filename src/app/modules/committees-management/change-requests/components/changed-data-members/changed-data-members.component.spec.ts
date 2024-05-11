import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangedDataMembersComponent } from './changed-data-members.component';

describe('ChangedDataMembersComponent', () => {
  let component: ChangedDataMembersComponent;
  let fixture: ComponentFixture<ChangedDataMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangedDataMembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangedDataMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
