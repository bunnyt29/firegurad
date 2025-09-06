import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateUpload } from './certificate-upload';

describe('CertificateUpload', () => {
  let component: CertificateUpload;
  let fixture: ComponentFixture<CertificateUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificateUpload]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificateUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
