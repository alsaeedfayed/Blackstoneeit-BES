/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EventRegistrationService } from './event-registration.service';

describe('Service: EventRegistration', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventRegistrationService]
    });
  });

  it('should ...', inject([EventRegistrationService], (service: EventRegistrationService) => {
    expect(service).toBeTruthy();
  }));
});
