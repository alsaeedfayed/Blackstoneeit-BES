import { TestBed } from '@angular/core/testing';

import { MeasurementTypeService } from './measurement-type.service';

describe('MeasurementTypeService', () => {
  let service: MeasurementTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeasurementTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
