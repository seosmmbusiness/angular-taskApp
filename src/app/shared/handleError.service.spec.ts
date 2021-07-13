/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { HandleErrorService } from './handleError.service';

describe('Service: HandleError', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HandleErrorService]
    });
  });

  it('should ...', inject([HandleErrorService], (service: HandleErrorService) => {
    expect(service).toBeTruthy();
  }));
});
