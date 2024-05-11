import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpentTotalTasksComponent } from './spent-total-tasks.component';

describe('SpentTotalTasksComponent', () => {
  let component: SpentTotalTasksComponent;
  let fixture: ComponentFixture<SpentTotalTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpentTotalTasksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpentTotalTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
