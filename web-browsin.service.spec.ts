import { TestBed } from '@angular/core/testing';

import { WebBrowsinService } from './web-browsin.service';

describe('WebBrowsinService', () => {
  let service: WebBrowsinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebBrowsinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
