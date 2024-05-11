import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeTypesComponent } from './committee-types.component';

describe('CommitteeTypesComponent', () => {
  let component: CommitteeTypesComponent;
  let fixture: ComponentFixture<CommitteeTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
