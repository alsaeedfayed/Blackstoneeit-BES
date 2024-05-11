import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRoleModalComponent } from './new-role-modal.component';

describe('NewRoleModalComponent', () => {
  let component: NewRoleModalComponent;
  let fixture: ComponentFixture<NewRoleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewRoleModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRoleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
