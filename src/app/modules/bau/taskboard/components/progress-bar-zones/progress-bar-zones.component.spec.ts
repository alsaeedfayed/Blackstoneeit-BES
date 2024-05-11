import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBarZonesComponent } from './progress-bar-zones.component';

describe('ProgressBarZonesComponent', () => {
  let component: ProgressBarZonesComponent;
  let fixture: ComponentFixture<ProgressBarZonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressBarZonesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressBarZonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
