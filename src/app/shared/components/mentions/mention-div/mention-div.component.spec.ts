import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentionDivComponent } from './mention-div.component';

describe('MentionDivComponent', () => {
  let component: MentionDivComponent;
  let fixture: ComponentFixture<MentionDivComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MentionDivComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MentionDivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
