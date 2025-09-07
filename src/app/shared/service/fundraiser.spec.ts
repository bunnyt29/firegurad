import { TestBed } from '@angular/core/testing';

import { Fundraiser } from './fundraiser';

describe('Fundraiser', () => {
  let service: Fundraiser;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Fundraiser);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
