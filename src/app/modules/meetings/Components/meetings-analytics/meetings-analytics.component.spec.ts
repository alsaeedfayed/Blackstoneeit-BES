import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingsAnalyticsComponent } from './meetings-analytics.component';

describe('MeetingsAnalyticsComponent', () => {
  let component: MeetingsAnalyticsComponent;
  let fixture: ComponentFixture<MeetingsAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingsAnalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingsAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
