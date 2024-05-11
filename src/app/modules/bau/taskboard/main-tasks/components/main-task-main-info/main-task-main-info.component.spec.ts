import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTaskMainInfoComponent } from './main-task-main-info.component';

describe('MainTaskMainInfoComponent', () => {
  let component: MainTaskMainInfoComponent;
  let fixture: ComponentFixture<MainTaskMainInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainTaskMainInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainTaskMainInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
