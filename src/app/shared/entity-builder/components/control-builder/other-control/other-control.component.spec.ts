import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherControlComponent } from './other-control.component';

describe('OtherControlComponent', () => {
  let component: OtherControlComponent;
  let fixture: ComponentFixture<OtherControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
