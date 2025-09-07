import {ChangeDetectorRef, Component, OnInit, Signal, signal} from '@angular/core';
import {ProfileService} from '../../services/profile';
import {Profile} from '../../../../shared/models/Profile';
import {toSignal} from '@angular/core/rxjs-interop';
import {catchError, map, of, switchMap, tap} from 'rxjs';
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
export class Details implements OnInit{
  profile: any;
  certificateUrl: string | null = null;
  private certificateUrlObj: string | null = null;

  constructor(
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchData()
  }

  fetchData() {
    this.profileService.get().pipe(
      tap(p => this.profile = p),
      switchMap(p =>
        p?.id
          ? this.profileService.getCertificate(p.id).pipe(
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

  ngOnDestroy() {
    if (this.certificateUrlObj) {
      URL.revokeObjectURL(this.certificateUrlObj);
    }
  }
}
