import {TestBed} from '@angular/core/testing';

import {Appearance} from './appearance.service';

describe('Appearence', () => {
  let service: Appearance;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Appearance);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
