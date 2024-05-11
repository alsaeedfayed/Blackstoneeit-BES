import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewExternalMemberModalComponent } from './new-external-member-modal.component';

describe('NewExternalMemberModalComponent', () => {
  let component: NewExternalMemberModalComponent;
  let fixture: ComponentFixture<NewExternalMemberModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewExternalMemberModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewExternalMemberModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
