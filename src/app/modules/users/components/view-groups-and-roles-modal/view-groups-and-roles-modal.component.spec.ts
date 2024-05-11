import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGroupsAndRolesModalComponent } from './view-groups-and-roles-modal.component';

describe('ViewGroupsAndRolesModalComponent', () => {
  let component: ViewGroupsAndRolesModalComponent;
  let fixture: ComponentFixture<ViewGroupsAndRolesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewGroupsAndRolesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGroupsAndRolesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
