import { TestBed } from '@angular/core/testing';

import { StrategicGoalsService } from './strategic-goals.service';

describe('StrategicGoalsService', () => {
  let service: StrategicGoalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrategicGoalsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
