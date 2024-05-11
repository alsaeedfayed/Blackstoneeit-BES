import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighRisksListComponent } from './high-risks-list.component';

describe('HighRisksListComponent', () => {
  let component: HighRisksListComponent;
  let fixture: ComponentFixture<HighRisksListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighRisksListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HighRisksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
