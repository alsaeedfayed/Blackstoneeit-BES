import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateItemProgressComponent } from './update-item-progress.component';

describe('UpdateItemProgressComponent', () => {
  let component: UpdateItemProgressComponent;
  let fixture: ComponentFixture<UpdateItemProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateItemProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateItemProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
