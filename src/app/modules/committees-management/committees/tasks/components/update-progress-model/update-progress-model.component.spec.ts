import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProgressModelComponent } from './update-progress-model.component';

describe('UpdateProgressModelComponent', () => {
  let component: UpdateProgressModelComponent;
  let fixture: ComponentFixture<UpdateProgressModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateProgressModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateProgressModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
