import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingsPerQuaraterComponent } from './meetings-per-quarater.component';

describe('MeetingsPerQuaraterComponent', () => {
  let component: MeetingsPerQuaraterComponent;
  let fixture: ComponentFixture<MeetingsPerQuaraterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingsPerQuaraterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingsPerQuaraterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
