/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProjectCommentsService } from './project-comments.service';

describe('Service: ProjectComments', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectCommentsService]
    });
  });

  it('should ...', inject([ProjectCommentsService], (service: ProjectCommentsService) => {
    expect(service).toBeTruthy();
  }));
});
