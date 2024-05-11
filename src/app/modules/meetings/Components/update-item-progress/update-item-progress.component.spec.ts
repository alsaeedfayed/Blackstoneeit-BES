import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateItemProgressComponent2 } from './update-item-progress.component';

describe('UpdateItemProgressComponent2', () => {
  let component: UpdateItemProgressComponent2;
  let fixture: ComponentFixture<UpdateItemProgressComponent2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateItemProgressComponent2 ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateItemProgressComponent2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
