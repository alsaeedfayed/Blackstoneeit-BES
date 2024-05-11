import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationMainPageComponent } from './evaluation-main-page.component';

describe('EvaluationMainPageComponent', () => {
  let component: EvaluationMainPageComponent;
  let fixture: ComponentFixture<EvaluationMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationMainPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
