import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSectorsComponent } from './dashboard-sectors.component';

describe('DashboardSectorsComponent', () => {
  let component: DashboardSectorsComponent;
  let fixture: ComponentFixture<DashboardSectorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardSectorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
