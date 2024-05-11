import { TestBed } from '@angular/core/testing';

import { ServicesDashboardService } from './services-dashboard.service';

describe('ServicesDashboardService', () => {
  let service: ServicesDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
