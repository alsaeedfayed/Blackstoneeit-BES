import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategicKPIsComponent } from './strategic-kpis.component';

describe('StrategicKPIsComponent', () => {
  let component: StrategicKPIsComponent;
  let fixture: ComponentFixture<StrategicKPIsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategicKPIsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategicKPIsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
