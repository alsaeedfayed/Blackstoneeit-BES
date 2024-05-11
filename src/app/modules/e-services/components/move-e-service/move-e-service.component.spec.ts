import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveEServiceComponent } from './move-e-service.component';

describe('MoveEServiceComponent', () => {
  let component: MoveEServiceComponent;
  let fixture: ComponentFixture<MoveEServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveEServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveEServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
