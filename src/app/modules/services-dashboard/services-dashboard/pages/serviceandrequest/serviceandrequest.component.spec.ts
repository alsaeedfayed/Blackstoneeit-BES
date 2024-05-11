import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceandrequestComponent } from './serviceandrequest.component';

describe('ServiceandrequestComponent', () => {
  let component: ServiceandrequestComponent;
  let fixture: ComponentFixture<ServiceandrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceandrequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceandrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
