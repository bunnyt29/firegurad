import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Profile} from '../../../../shared/models/Profile';
import {ProfileService} from '../../services/profile';
import {Preferences} from '@capacitor/preferences';
import {CookieService} from 'ngx-cookie-service';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-edit',
  imports: [],
  templateUrl: './edit.html',
  styleUrl: './edit.scss',
  standalone: true
})
export class Edit {
  profile!: Profile;
  profileForm!: FormGroup;
  accessToken!: string | null;

  constructor(
    private fb: FormBuilder,
    private profileSerivce: ProfileService,
    private route: ActivatedRoute,
    private cookieService: CookieService
  ) {}

  async ngOnInit() {
    this.accessToken = this.route.snapshot.queryParamMap.get('access_token');
    if (this.accessToken != null) {
      this.cookieService.set('auth', this.accessToken, {path: '/'});
    }
    this.profileForm = this.fb.group({
      'id': [''],
      'name': [''],
      'email': [''],
      'picture': [''],
      'phone': [''],
      'experience': [''],
      'skills': [''],
      'isCertified': ['']
    });
    // if (this.accessToken) {
    //   await Preferences.set({
    //     key: 'token',
    //     value: JSON.stringify({
    //       access_token: this.accessToken
    //     })
    //   });
    // }

    this.fetchData();
  }

  fetchData() {
    this.profileSerivce.get().subscribe(res => {
      this.profile = res;
      console.log(this.profile);

      this.profileForm.patchValue({
        'id': this.profile.id,
        'name': this.profile.name,
        'email': this.profile.email,
        'picture': this.profile.picture,
        'phone': this.profile.phone,
        'experience': this.profile.experience,
        'skills': this.profile.skills,
        'isCertified': this.profile.isCertified
      });
    })
  }
}
