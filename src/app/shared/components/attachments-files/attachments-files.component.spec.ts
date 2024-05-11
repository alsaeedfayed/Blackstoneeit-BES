import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentsFilesComponent } from './attachments-files.component';

describe('AttachmentsFilesComponent', () => {
  let component: AttachmentsFilesComponent;
  let fixture: ComponentFixture<AttachmentsFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachmentsFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentsFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
