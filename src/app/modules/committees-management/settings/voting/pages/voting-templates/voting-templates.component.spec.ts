import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingTemplatesComponent } from './voting-templates.component';

describe('VotingTemplatesComponent', () => {
  let component: VotingTemplatesComponent;
  let fixture: ComponentFixture<VotingTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotingTemplatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
