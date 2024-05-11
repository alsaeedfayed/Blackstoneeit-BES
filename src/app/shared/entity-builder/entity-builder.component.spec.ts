import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityBuilderComponent } from './entity-builder.component';

describe('EntityBuilderComponent', () => {
  let component: EntityBuilderComponent;
  let fixture: ComponentFixture<EntityBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
