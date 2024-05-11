import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeCreationBasicInfoComponent } from './committee-creation-basic-info.component';

describe('CommitteeCreationBasicInfoComponent', () => {
  let component: CommitteeCreationBasicInfoComponent;
  let fixture: ComponentFixture<CommitteeCreationBasicInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeCreationBasicInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeCreationBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
