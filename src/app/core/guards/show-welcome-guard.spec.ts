import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { showWelcomeGuard } from './show-welcome-guard';

describe('showWelcomeGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => showWelcomeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
