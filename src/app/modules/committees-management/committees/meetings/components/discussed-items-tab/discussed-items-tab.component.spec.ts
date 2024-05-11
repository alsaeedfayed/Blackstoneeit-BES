import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussedItemsTabComponent } from './discussed-items-tab.component';

describe('DiscussedItemsTabComponent', () => {
  let component: DiscussedItemsTabComponent;
  let fixture: ComponentFixture<DiscussedItemsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscussedItemsTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussedItemsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
