import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeInfoPanelComponent } from './committee-info-panel.component';

describe('CommitteeInfoPanelComponent', () => {
  let component: CommitteeInfoPanelComponent;
  let fixture: ComponentFixture<CommitteeInfoPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeInfoPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeInfoPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
