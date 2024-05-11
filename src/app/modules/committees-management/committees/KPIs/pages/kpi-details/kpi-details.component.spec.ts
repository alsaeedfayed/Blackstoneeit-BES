import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KPIDetailsComponent } from './kpi-details.component';

describe('KPIDetailsComponent', () => {
  let component: KPIDetailsComponent;
  let fixture: ComponentFixture<KPIDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KPIDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KPIDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
