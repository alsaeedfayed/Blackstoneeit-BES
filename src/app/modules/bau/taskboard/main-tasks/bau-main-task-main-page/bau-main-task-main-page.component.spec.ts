import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BauMainTaskMainPageComponent } from './bau-main-task-main-page.component';

describe('BauMainTaskMainPageComponent', () => {
  let component: BauMainTaskMainPageComponent;
  let fixture: ComponentFixture<BauMainTaskMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BauMainTaskMainPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BauMainTaskMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
