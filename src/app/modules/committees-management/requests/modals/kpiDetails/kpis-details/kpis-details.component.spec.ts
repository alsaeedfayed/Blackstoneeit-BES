import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpisDetailsComponent } from './kpis-details.component';

describe('KpisDetailsComponent', () => {
  let component: KpisDetailsComponent;
  let fixture: ComponentFixture<KpisDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpisDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpisDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
