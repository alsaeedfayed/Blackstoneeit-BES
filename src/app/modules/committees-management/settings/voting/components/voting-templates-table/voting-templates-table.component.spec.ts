import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingTemplatesTableComponent } from './voting-templates-table.component';

describe('VotingTemplatesTableComponent', () => {
  let component: VotingTemplatesTableComponent;
  let fixture: ComponentFixture<VotingTemplatesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotingTemplatesTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingTemplatesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
