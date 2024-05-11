import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEServiceComponent } from './create-e-service.component';

describe('CreateEServiceComponent', () => {
  let component: CreateEServiceComponent;
  let fixture: ComponentFixture<CreateEServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
