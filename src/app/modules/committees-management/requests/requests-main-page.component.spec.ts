import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsMainPageComponent } from './requests-main-page.component';

describe('RequestsMainPageComponent', () => {
  let component: RequestsMainPageComponent;
  let fixture: ComponentFixture<RequestsMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestsMainPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
