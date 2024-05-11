import { TestBed } from '@angular/core/testing';

import { ModifyRequestsService } from './modify-requests.service';

describe('ModifyRequestsService', () => {
  let service: ModifyRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModifyRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
