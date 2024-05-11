import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentsZoneComponent } from './attachments-zone.component';

describe('AttachmentsZoneComponent', () => {
  let component: AttachmentsZoneComponent;
  let fixture: ComponentFixture<AttachmentsZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachmentsZoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentsZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
