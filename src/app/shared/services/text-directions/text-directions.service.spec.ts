import { TestBed } from '@angular/core/testing';

import { TextDirectionsService } from './text-directions.service';

describe('TextDirectionsService', () => {
  let service: TextDirectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextDirectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
