import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentAdvancedFilterComponent } from './agent-advanced-filter.component';

describe('AgentAdvancedFilterComponent', () => {
  let component: AgentAdvancedFilterComponent;
  let fixture: ComponentFixture<AgentAdvancedFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentAdvancedFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentAdvancedFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
