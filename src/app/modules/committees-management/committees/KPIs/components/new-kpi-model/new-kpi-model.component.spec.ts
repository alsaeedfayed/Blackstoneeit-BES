import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewKPIModelComponent } from './new-kpi-model.component';

describe('NewKPIModelComponent', () => {
  let component: NewKPIModelComponent;
  let fixture: ComponentFixture<NewKPIModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewKPIModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewKPIModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
