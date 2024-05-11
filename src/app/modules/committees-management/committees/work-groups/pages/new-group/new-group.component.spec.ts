import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGroupComponent } from './new-group.component';

describe('NewSubgroupComponent', () => {
  let component: NewGroupComponent;
  let fixture: ComponentFixture<NewGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
