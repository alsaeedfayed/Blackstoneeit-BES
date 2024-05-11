import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuageDrawerComponent } from './guage-drawer.component';

describe('GuageDrawerComponent', () => {
  let component: GuageDrawerComponent;
  let fixture: ComponentFixture<GuageDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuageDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuageDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
