import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BauComponent } from './bau.component';

describe('BauComponent', () => {
  let component: BauComponent;
  let fixture: ComponentFixture<BauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BauComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
