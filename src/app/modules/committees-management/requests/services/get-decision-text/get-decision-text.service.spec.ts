import { TestBed } from '@angular/core/testing';

import { GetDecisionTextService } from './get-decision-text.service';

describe('GetDecisionTextService', () => {
  let service: GetDecisionTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetDecisionTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
