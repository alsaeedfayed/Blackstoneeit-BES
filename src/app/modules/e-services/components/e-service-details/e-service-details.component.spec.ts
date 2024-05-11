import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EServiceDetailsComponent } from './e-service-details.component';

describe('EServiceDetailsComponent', () => {
  let component: EServiceDetailsComponent;
  let fixture: ComponentFixture<EServiceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EServiceDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EServiceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
