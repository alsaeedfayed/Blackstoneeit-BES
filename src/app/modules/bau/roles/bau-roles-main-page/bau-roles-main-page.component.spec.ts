import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BauRolesMainPageComponent } from './bau-roles-main-page.component';

describe('BauRolesMainPageComponent', () => {
  let component: BauRolesMainPageComponent;
  let fixture: ComponentFixture<BauRolesMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BauRolesMainPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BauRolesMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
