/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProjectDocumentsService } from './project-documents.service';

describe('Service: ProjectDocuments', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectDocumentsService]
    });
  });

  it('should ...', inject([ProjectDocumentsService], (service: ProjectDocumentsService) => {
    expect(service).toBeTruthy();
  }));
});
