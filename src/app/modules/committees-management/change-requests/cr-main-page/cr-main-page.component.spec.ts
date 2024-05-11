import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrMainPageComponent } from './cr-main-page.component';

describe('CrMainPageComponent', () => {
  let component: CrMainPageComponent;
  let fixture: ComponentFixture<CrMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrMainPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
