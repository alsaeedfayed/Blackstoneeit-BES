import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiDetailsModelComponent } from './kpi-details-model.component';

describe('KpiDetailsModelComponent', () => {
  let component: KpiDetailsModelComponent;
  let fixture: ComponentFixture<KpiDetailsModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiDetailsModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiDetailsModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
