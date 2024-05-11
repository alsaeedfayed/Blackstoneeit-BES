import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRequestsRowComponent } from './change-requests-row.component';

describe('ChangeRequestsRowComponent', () => {
  let component: ChangeRequestsRowComponent;
  let fixture: ComponentFixture<ChangeRequestsRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeRequestsRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRequestsRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
