/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ConfirmModalService } from './confirm-modal.service';

describe('Service: ConfirmModal', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfirmModalService]
    });
  });

  it('should ...', inject([ConfirmModalService], (service: ConfirmModalService) => {
    expect(service).toBeTruthy();
  }));
});
