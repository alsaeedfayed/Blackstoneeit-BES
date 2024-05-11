import { TestBed } from '@angular/core/testing';

import { MainTaskStatusService } from './main-task-status.service';

describe('MainTaskStatusService', () => {
  let service: MainTaskStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainTaskStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
