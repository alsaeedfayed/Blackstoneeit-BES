import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkGroupsCardsComponent } from './work-groups-cards.component';

describe('WorkGroupsCardsComponent', () => {
  let component: WorkGroupsCardsComponent;
  let fixture: ComponentFixture<WorkGroupsCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkGroupsCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkGroupsCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
