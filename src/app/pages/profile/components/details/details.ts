import {Component, OnInit} from '@angular/core';
import {ProfileService} from '../../services/profile';
import {Profile} from '../../../../shared/models/Profile';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.html',
  standalone: true,
  styleUrl: './details.scss'
})
export class Details implements OnInit {
  profile!: Profile;

  constructor(
    private profileSerivce: ProfileService
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.profileSerivce.get().subscribe(res => {
      this.profile = res;
    })
  }
}
