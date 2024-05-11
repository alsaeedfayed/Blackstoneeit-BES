import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InProgressTaskComponent } from './in-progress-task.component';

describe('InProgressTaskComponent', () => {
  let component: InProgressTaskComponent;
  let fixture: ComponentFixture<InProgressTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InProgressTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InProgressTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
