import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityBoxComponent } from './entity-box.component';

describe('EntityBoxComponent', () => {
  let component: EntityBoxComponent;
  let fixture: ComponentFixture<EntityBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
