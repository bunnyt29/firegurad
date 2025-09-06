import {ChangeDetectorRef, Component, OnInit, Signal, signal} from '@angular/core';
import {ProfileService} from '../../services/profile';
import {Profile} from '../../../../shared/models/Profile';
import {toSignal} from '@angular/core/rxjs-interop';
import {catchError, of, tap} from 'rxjs';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-details',
  imports: [
    RouterLink
  ],
  templateUrl: './details.html',
  standalone: true,
  styleUrl: './details.scss'
})
export class Details {
  profile!: Profile;

  certificateUrl: string | null = null;

  constructor(
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.profileService.get().subscribe(res => {
      this.profile = res;
      this.cdr.detectChanges();

      if (this.profile?.id) {
        this.profileService.getCertificate(this.profile.id).subscribe((blob) => {
          this.certificateUrl = URL.createObjectURL(blob);
        });
      }
    })
  }
}
