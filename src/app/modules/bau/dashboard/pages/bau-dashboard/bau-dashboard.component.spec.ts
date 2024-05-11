import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BauDashboardComponent } from './bau-dashboard.component';

describe('BauDashboardComponent', () => {
  let component: BauDashboardComponent;
  let fixture: ComponentFixture<BauDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BauDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BauDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
