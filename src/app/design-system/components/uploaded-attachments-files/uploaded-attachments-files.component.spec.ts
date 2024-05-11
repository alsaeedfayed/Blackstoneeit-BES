import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedAttachmentsFilesComponent } from './uploaded-attachments-files.component';

describe('UploadedAttachmentsFilesComponent', () => {
  let component: UploadedAttachmentsFilesComponent;
  let fixture: ComponentFixture<UploadedAttachmentsFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadedAttachmentsFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadedAttachmentsFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
