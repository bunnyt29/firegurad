import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Profile } from '../../../../shared/models/Profile';
import { ProfileService } from '../../services/profile';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CertificateUpload } from '../certificate-upload/certificate-upload';
import { AuthService } from '../../../auth/services/auth';
import {catchError, map, of, switchMap, tap} from 'rxjs';

@Component({
  selector: 'app-edit',
  imports: [RouterLink, ReactiveFormsModule, CertificateUpload],
  templateUrl: './edit.html',
  styleUrl: './edit.scss',
  standalone: true,
})
export class Edit {
  profile!: Profile;
  profileForm!: FormGroup;

  certificateUrl: string | null = null;
  private certificateUrlObj: string | null = null;

  constructor(
    private fb: FormBuilder,
    private profileSerivce: ProfileService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) {}

  async ngOnInit() {
    const isFirstLogin = this.route.snapshot.queryParamMap.get('isFirstLogin');
    const accessToken = this.route.snapshot.queryParamMap.get('access_token');
    const userType = this.route.snapshot.queryParamMap.get('type');

    if (accessToken != null && userType != null) this.authService.saveAuth(accessToken, userType);
    if (isFirstLogin === 'false') this.router.navigateByUrl('/profile/details');

    this.profileForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: [{ value: '', disabled: false }],
      picture: [''],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{9,15}$/)]],
      experience: [''],
      skills: [''],
      isCertified: [false],
    });

    this.fetchData();
  }

  fetchData() {
    this.profileSerivce.get().pipe(
      tap(res => {
        this.profile = res;
        this.profileForm.patchValue({
          id: res.id,
          name: res.name ?? '',
          email: res.email ?? '',
          picture: res.picture ?? '',
          phone: res.phone ?? '',
          experience: res.experience ?? '',
          skills: res.skills ?? '',
          isCertified: !!res.isCertified,
        });
        this.profileForm.get('email')?.disable({ emitEvent: false });
      }),
      switchMap(p =>
        p?.id
          ? this.profileSerivce.getCertificate(p.id).pipe(
            map(blob => (blob && blob.size > 0 ? blob : null)),
            catchError(() => of(null))
          )
          : of(null)
      )
    ).subscribe(blob => {
      if (this.certificateUrlObj) {
        URL.revokeObjectURL(this.certificateUrlObj);
        this.certificateUrlObj = null;
      }

      if (blob) {
        this.certificateUrlObj = URL.createObjectURL(blob);
        this.certificateUrl = this.certificateUrlObj;
      } else {
        this.certificateUrl = null;
      }

      this.cdr.markForCheck();
    });
  }

  save() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const payload = { ...this.profileForm.getRawValue() };
    this.profileSerivce.edit(payload).subscribe(() => {
      this.router.navigate(['/profile/details']);
    });
  }

  get name() { return this.profileForm.get('name'); }
  get phone() { return this.profileForm.get('phone'); }

  onCertificateUploaded(_: { fileName: string }) {
    if (!this.profile?.id) return;

    this.profileSerivce.getCertificate(this.profile.id).pipe(
      map(blob => (blob && blob.size > 0 ? blob : null)),
      catchError(() => of(null))
    ).subscribe(blob => {
      if (this.certificateUrlObj) {
        URL.revokeObjectURL(this.certificateUrlObj);
        this.certificateUrlObj = null;
      }
      if (blob) {
        this.certificateUrlObj = URL.createObjectURL(blob);
        this.certificateUrl = this.certificateUrlObj;
      } else {
        this.certificateUrl = null;
      }
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    if (this.certificateUrlObj) URL.revokeObjectURL(this.certificateUrlObj);
  }

  goBack() {
    this.router.navigateByUrl('/profile/details');
  }
}
