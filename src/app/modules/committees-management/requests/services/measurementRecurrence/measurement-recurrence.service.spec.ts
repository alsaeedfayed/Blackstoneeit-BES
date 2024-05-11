import { TestBed } from '@angular/core/testing';

import { MeasurementRecurrenceService } from './measurement-recurrence.service';

describe('MeasurementRecurrenceService', () => {
  let service: MeasurementRecurrenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeasurementRecurrenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
