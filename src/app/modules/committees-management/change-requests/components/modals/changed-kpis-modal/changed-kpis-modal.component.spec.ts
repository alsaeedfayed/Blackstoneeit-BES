import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangedKpisModalComponent } from './changed-kpis-modal.component';

describe('ChangedKpisModalComponent', () => {
  let component: ChangedKpisModalComponent;
  let fixture: ComponentFixture<ChangedKpisModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangedKpisModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangedKpisModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
