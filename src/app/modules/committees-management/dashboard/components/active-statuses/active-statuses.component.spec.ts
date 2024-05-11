import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveStatusesComponent } from './active-statuses.component';

describe('ActiveStatusesComponent', () => {
  let component: ActiveStatusesComponent;
  let fixture: ComponentFixture<ActiveStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveStatusesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
