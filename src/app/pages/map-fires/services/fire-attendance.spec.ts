import { TestBed } from '@angular/core/testing';

import { FireAttendance } from './fire-attendance';

describe('FireAttendance', () => {
  let service: FireAttendance;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireAttendance);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
