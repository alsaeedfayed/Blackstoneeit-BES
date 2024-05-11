import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangedKpisRowsComponent } from './changed-kpis-rows.component';

describe('ChangedKpisRowsComponent', () => {
  let component: ChangedKpisRowsComponent;
  let fixture: ComponentFixture<ChangedKpisRowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangedKpisRowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangedKpisRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
