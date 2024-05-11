import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesRowsComponent } from './roles-rows.component';

describe('RolesRowsComponent', () => {
  let component: RolesRowsComponent;
  let fixture: ComponentFixture<RolesRowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesRowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
