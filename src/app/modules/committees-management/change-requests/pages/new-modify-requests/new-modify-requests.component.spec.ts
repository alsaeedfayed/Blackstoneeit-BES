import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewModifyRequestsComponent } from './new-modify-requests.component';

describe('NewModifyRequestsComponent', () => {
  let component: NewModifyRequestsComponent;
  let fixture: ComponentFixture<NewModifyRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewModifyRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewModifyRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
