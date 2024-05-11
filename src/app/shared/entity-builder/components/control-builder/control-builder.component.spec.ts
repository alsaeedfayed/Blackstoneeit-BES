import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderEntityComponent } from './control-builder.component';

describe('BuilderEntityComponent', () => {
  let component: BuilderEntityComponent;
  let fixture: ComponentFixture<BuilderEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuilderEntityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuilderEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
