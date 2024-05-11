import { TestBed } from '@angular/core/testing';

import { MeetingStatusService } from './meeting-status.service';

describe('MeetingStatusService', () => {
  let service: MeetingStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
