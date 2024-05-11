import { TestBed } from '@angular/core/testing';

import { DestroyChartGuard } from './destroy-chart.guard';

describe('DestroyChartGuard', () => {
  let guard: DestroyChartGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DestroyChartGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
