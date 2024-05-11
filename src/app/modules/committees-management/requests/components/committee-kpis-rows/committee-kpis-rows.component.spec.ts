import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeKpisRowsComponent } from './committee-kpis-rows.component';

describe('CommitteeKpisRowsComponent', () => {
  let component: CommitteeKpisRowsComponent;
  let fixture: ComponentFixture<CommitteeKpisRowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeKpisRowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeKpisRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
