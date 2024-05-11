import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesCoveragesComponent } from './roles-coverages.component';

describe('RolesCoveragesComponent', () => {
  let component: RolesCoveragesComponent;
  let fixture: ComponentFixture<RolesCoveragesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesCoveragesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesCoveragesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
