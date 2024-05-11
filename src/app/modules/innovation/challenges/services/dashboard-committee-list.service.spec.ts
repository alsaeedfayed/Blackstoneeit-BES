import { TestBed } from '@angular/core/testing';

import { DashboardCommitteeListService } from './dashboard-committee-list.service';

describe('DashboardCommitteeListService', () => {
  let service: DashboardCommitteeListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardCommitteeListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
