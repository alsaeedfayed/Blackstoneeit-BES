import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTaskDetailsComponent } from './main-task-details.component';

describe('MainTaskDetailsComponent', () => {
  let component: MainTaskDetailsComponent;
  let fixture: ComponentFixture<MainTaskDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainTaskDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainTaskDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
