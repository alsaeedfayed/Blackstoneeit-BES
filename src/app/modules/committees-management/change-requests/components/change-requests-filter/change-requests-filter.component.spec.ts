import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRequestsFilterComponent } from './change-requests-filter.component';

describe('ChangeRequestsFilterComponent', () => {
  let component: ChangeRequestsFilterComponent;
  let fixture: ComponentFixture<ChangeRequestsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeRequestsFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRequestsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
