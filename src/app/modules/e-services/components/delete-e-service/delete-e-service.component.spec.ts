import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEServiceComponent } from './delete-e-service.component';

describe('DeleteEServiceComponent', () => {
  let component: DeleteEServiceComponent;
  let fixture: ComponentFixture<DeleteEServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteEServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteEServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
