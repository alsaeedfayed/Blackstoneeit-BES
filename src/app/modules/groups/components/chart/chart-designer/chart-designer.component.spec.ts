import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartDesignerComponent } from './chart-designer.component';

describe('ChartDesignerComponent', () => {
  let component: ChartDesignerComponent;
  let fixture: ComponentFixture<ChartDesignerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartDesignerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartDesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
