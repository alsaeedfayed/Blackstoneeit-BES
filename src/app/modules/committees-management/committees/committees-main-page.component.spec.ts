import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteesMainPageComponent } from './committees-main-page.component';

describe('CommitteesMainPageComponent', () => {
  let component: CommitteesMainPageComponent;
  let fixture: ComponentFixture<CommitteesMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteesMainPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteesMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
