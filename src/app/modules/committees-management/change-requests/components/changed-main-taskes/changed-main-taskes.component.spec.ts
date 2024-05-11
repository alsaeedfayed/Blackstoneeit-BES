import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangedMainTaskesComponent } from './changed-main-taskes.component';

describe('ChangedMainTaskesComponent', () => {
  let component: ChangedMainTaskesComponent;
  let fixture: ComponentFixture<ChangedMainTaskesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangedMainTaskesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangedMainTaskesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
