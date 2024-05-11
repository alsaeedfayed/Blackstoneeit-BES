import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BauRolesComponent } from './bau-roles.component';

describe('BauRolesComponent', () => {
  let component: BauRolesComponent;
  let fixture: ComponentFixture<BauRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BauRolesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BauRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
