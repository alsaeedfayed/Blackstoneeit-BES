import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionWithAttachmentsComponent } from './description-with-attachments.component';

describe('DescriptionWithAttachmentsComponent', () => {
  let component: DescriptionWithAttachmentsComponent;
  let fixture: ComponentFixture<DescriptionWithAttachmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescriptionWithAttachmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionWithAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
