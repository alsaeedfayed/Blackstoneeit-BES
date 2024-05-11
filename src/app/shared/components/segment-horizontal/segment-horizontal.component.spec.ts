import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentHorizontalComponent } from './segment-horizontal.component';

describe('SegmentHorizontalComponent', () => {
  let component: SegmentHorizontalComponent;
  let fixture: ComponentFixture<SegmentHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SegmentHorizontalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
