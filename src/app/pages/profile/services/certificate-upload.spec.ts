import { TestBed } from '@angular/core/testing';

import { CertificateUpload } from './certificate-upload';

describe('CertificateUpload', () => {
  let service: CertificateUpload;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CertificateUpload);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
