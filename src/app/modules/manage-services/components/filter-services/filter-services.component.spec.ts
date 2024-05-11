import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterServicesComponent } from './filter-services.component';

describe('FilterServicesComponent', () => {
  let component: FilterServicesComponent;
  let fixture: ComponentFixture<FilterServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterServicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
