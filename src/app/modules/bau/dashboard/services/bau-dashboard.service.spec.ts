import { TestBed } from '@angular/core/testing';

import { BauDashboardService } from './bau-dashboard.service';

describe('BauDashboardService', () => {
  let service: BauDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BauDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
