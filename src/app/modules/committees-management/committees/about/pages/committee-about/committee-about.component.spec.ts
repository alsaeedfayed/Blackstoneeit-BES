import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeAboutComponent } from './committee-about.component';

describe('CommitteeAboutComponent', () => {
  let component: CommitteeAboutComponent;
  let fixture: ComponentFixture<CommitteeAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeAboutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
