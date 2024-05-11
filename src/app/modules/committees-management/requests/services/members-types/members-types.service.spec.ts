import { TestBed } from '@angular/core/testing';

import { MembersTypesService } from './members-types.service';

describe('MembersTypesService', () => {
  let service: MembersTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MembersTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
