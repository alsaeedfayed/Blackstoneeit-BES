import { TestBed } from '@angular/core/testing';

import { CommitteeDecisionService } from './committee-decision.service';

describe('CommitteeDecisionService', () => {
  let service: CommitteeDecisionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommitteeDecisionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
