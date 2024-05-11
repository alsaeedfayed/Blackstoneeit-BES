import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityDesignerComponent } from './entity-designer.component';

describe('EntityDesignerComponent', () => {
  let component: EntityDesignerComponent;
  let fixture: ComponentFixture<EntityDesignerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityDesignerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityDesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
