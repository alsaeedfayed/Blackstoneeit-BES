import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsFiltersComponent } from './requests-filters.component';

describe('RequestsFiltersComponent', () => {
  let component: RequestsFiltersComponent;
  let fixture: ComponentFixture<RequestsFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestsFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
