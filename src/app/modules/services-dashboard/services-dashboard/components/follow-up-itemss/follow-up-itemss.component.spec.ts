import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpItemssComponent } from './follow-up-itemss.component';

describe('FollowUpItemssComponent', () => {
  let component: FollowUpItemssComponent;
  let fixture: ComponentFixture<FollowUpItemssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowUpItemssComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowUpItemssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
