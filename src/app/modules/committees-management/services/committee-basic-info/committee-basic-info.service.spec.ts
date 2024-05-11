import { TestBed } from '@angular/core/testing';

import { CommitteeBasicInfoService } from './committee-basic-info.service';

describe('CommitteeBasicInfoService', () => {
  let service: CommitteeBasicInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommitteeBasicInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
