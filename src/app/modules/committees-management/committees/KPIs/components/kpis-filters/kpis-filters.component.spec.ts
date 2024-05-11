import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpisFiltersComponent } from './kpis-filters.component';

describe('KpisFiltersComponent', () => {
  let component: KpisFiltersComponent;
  let fixture: ComponentFixture<KpisFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpisFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpisFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
