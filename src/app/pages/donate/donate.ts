import {Component, OnInit} from '@angular/core';
import {Fundraiser} from '../../shared/service/fundraiser';

@Component({
  selector: 'app-donate',
  imports: [],
  templateUrl: './donate.html',
  standalone: true,
  styleUrl: './donate.scss'
})
export class Donate implements OnInit{
  fundraiser!: Fundraiser;

  constructor(
    private fundraiserService: Fundraiser
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData(){
    this.fundraiserService.get().subscribe(res => {
      this.fundraiser = res;
      console.log(this.fundraiser)
    })
  }
}
