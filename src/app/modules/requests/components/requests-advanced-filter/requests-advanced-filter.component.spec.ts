import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsAdvancedFilterComponent } from './requests-advanced-filter.component';

describe('RequestsAdvancedFilterComponent', () => {
  let component: RequestsAdvancedFilterComponent;
  let fixture: ComponentFixture<RequestsAdvancedFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestsAdvancedFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestsAdvancedFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
