import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportanceLevelComponent } from './importance-level.component';

describe('ImportanceLevelComponent', () => {
  let component: ImportanceLevelComponent;
  let fixture: ComponentFixture<ImportanceLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportanceLevelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportanceLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
