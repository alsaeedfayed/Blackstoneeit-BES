import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicInformationRowsComponent } from './basic-information-rows.component';

describe('BasicInformationRowsComponent', () => {
  let component: BasicInformationRowsComponent;
  let fixture: ComponentFixture<BasicInformationRowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicInformationRowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicInformationRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
