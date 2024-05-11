import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpTopEmpsComponent } from './follow-up-top-emps.component';

describe('FollowUpTopEmpsComponent', () => {
  let component: FollowUpTopEmpsComponent;
  let fixture: ComponentFixture<FollowUpTopEmpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowUpTopEmpsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowUpTopEmpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
