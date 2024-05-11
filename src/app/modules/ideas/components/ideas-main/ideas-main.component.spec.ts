import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeasMainComponent } from './ideas-main.component';

describe('IdeasMainComponent', () => {
  let component: IdeasMainComponent;
  let fixture: ComponentFixture<IdeasMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdeasMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdeasMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
