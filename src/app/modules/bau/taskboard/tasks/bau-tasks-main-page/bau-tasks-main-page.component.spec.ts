import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BauTasksMainPageComponent } from './bau-tasks-main-page.component';

describe('BauTasksMainPageComponent', () => {
  let component: BauTasksMainPageComponent;
  let fixture: ComponentFixture<BauTasksMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BauTasksMainPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BauTasksMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
