import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowAddItemComponent } from './follow-add-item.component';

describe('FollowAddItemComponent', () => {
  let component: FollowAddItemComponent;
  let fixture: ComponentFixture<FollowAddItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowAddItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowAddItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
