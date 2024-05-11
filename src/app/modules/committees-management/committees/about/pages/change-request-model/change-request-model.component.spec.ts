import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRequestModelComponent } from './change-request-model.component';

describe('ChangeRequestModelComponent', () => {
  let component: ChangeRequestModelComponent;
  let fixture: ComponentFixture<ChangeRequestModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeRequestModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRequestModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
