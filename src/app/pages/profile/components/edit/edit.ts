import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Profile } from '../../../../shared/models/Profile';
import { ProfileService } from '../../services/profile';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CertificateUpload } from '../certificate-upload/certificate-upload';
import { AuthService } from '../../../auth/services/auth';

@Component({
  selector: 'app-edit',
  imports: [RouterLink, ReactiveFormsModule, CertificateUpload],
  templateUrl: './edit.html',
  styleUrl: './edit.scss',
  standalone: true,
})
export class Edit {
  // profile!: Profile;
  // profileForm!: FormGroup;
  // accessToken!: string | null;
  //
  // constructor(
  //   private fb: FormBuilder,
  //   private profileSerivce: ProfileService,
  //   private route: ActivatedRoute,
  //   private cookieService: CookieService,
  //   private cdr: ChangeDetectorRef
  // ) {}
  //
  // async ngOnInit() {
  //   this.accessToken = this.route.snapshot.queryParamMap.get('access_token');
  //   if (this.accessToken != null) {
  //     this.cookieService.set('auth', this.accessToken, {path: '/'});
  //   }
  //   this.profileForm = this.fb.group({
  //     'id': [''],
  //     'name': [''],
  //     'email': [''],
  //     'picture': [''],
  //     'phone': [''],
  //     'experience': [''],
  //     'skills': [''],
  //     'isCertified': ['']
  //   });
  //   // if (this.accessToken) {
  //   //   await Preferences.set({
  //   //     key: 'token',
  //   //     value: JSON.stringify({
  //   //       access_token: this.accessToken
  //   //     })
  //   //   });
  //   // }
  //
  //   this.fetchData();
  // }
  //
  // fetchData() {
  //   this.profileSerivce.get().subscribe(res => {
  //     this.profile = res;
  //     this.cdr.detectChanges();
  //     console.log(this.profile);
  //
  //     this.profileForm.patchValue({
  //       'id': this.profile.id,
  //       'name': this.profile.name,
  //       'email': this.profile.email,
  //       'picture': this.profile.picture,
  //       'phone': this.profile.phone,
  //       'experience': this.profile.experience,
  //       'skills': this.profile.skills,
  //       'isCertified': this.profile.isCertified
  //     });
  //   })
  // }
  profile!: Profile;
  profileForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private profileSerivce: ProfileService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
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
      email: [{ value: '', disabled: false }], // read-only in UI but we keep it enabled to display easily
      picture: [''],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{9,15}$/)]],
      experience: [''],
      skills: [''],
      isCertified: [false],
    });

    this.fetchData();
  }

  fetchData() {
    this.profileSerivce.get().subscribe((res) => {
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

      // lock email against edits but keep the value shown
      this.profileForm.get('email')?.disable({ emitEvent: false });

      this.cdr.detectChanges();
    });
  }

  save() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.profileForm.getRawValue(),
    };

    this.profileSerivce.edit(payload).subscribe((res) => {
      this.router.navigate(['/profile/details']);
    });
  }

  get name() {
    return this.profileForm.get('name');
  }
  get phone() {
    return this.profileForm.get('phone');
  }

  onCertificateUploaded(e: { fileName: string }) {
    console.log('Certificate uploaded:', e.fileName);
  }
}
