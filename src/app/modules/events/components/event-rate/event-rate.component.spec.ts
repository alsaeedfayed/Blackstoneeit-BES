/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EventRateComponent } from './event-rate.component';

describe('EventRateComponent', () => {
  let component: EventRateComponent;
  let fixture: ComponentFixture<EventRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
