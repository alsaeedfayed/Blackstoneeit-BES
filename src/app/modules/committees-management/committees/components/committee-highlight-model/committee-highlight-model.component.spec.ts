import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeHighlightModelComponent } from './committee-highlight-model.component';

describe('CommitteeHighlightModelComponent', () => {
  let component: CommitteeHighlightModelComponent;
  let fixture: ComponentFixture<CommitteeHighlightModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeHighlightModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeHighlightModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
