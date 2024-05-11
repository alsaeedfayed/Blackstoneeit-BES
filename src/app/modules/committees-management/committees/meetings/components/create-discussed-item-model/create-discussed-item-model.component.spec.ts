import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDiscussedItemModelComponent } from './create-discussed-item-model.component';

describe('CreateDiscussedItemModelComponent', () => {
  let component: CreateDiscussedItemModelComponent;
  let fixture: ComponentFixture<CreateDiscussedItemModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDiscussedItemModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDiscussedItemModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
