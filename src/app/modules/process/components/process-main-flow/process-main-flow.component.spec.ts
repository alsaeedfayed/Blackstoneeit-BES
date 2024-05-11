import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessMainFlowComponent } from './process-main-flow.component';

describe('ProcessMainFlowComponent', () => {
  let component: ProcessMainFlowComponent;
  let fixture: ComponentFixture<ProcessMainFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessMainFlowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessMainFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
