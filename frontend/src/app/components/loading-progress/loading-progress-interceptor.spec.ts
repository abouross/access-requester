import {TestBed} from '@angular/core/testing';
import {HttpInterceptorFn} from '@angular/common/http';

import {loadingProgressInterceptor} from './loading-progress-interceptor';

describe('loadingProgressInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => loadingProgressInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
