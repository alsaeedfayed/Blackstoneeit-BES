import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpisRowsComponent } from './kpis-rows.component';

describe('KpisRowsComponent', () => {
  let component: KpisRowsComponent;
  let fixture: ComponentFixture<KpisRowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpisRowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpisRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
