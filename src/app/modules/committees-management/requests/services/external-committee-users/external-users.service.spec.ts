import { TestBed } from '@angular/core/testing';

import { ExternalUsersService } from './external-users.service';

describe('ExternalUsersService', () => {
  let service: ExternalUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
