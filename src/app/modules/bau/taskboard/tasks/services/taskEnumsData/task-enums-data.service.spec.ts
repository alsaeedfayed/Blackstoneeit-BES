import { TestBed } from '@angular/core/testing';

import { TaskEnumsDataService } from './task-enums-data.service';

describe('TaskEnumsDataService', () => {
  let service: TaskEnumsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskEnumsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
