import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeKPIsComponent } from './committee-kpis.component';

describe('CommitteeKPIsComponent', () => {
  let component: CommitteeKPIsComponent;
  let fixture: ComponentFixture<CommitteeKPIsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeKPIsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeKPIsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
