import {Component, OnInit} from '@angular/core';
import {Fundraiser} from '../../shared/models/Fundraiser';
import {FundraiserService} from '../../shared/service/fundraiser';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-donate',
  imports: [],
  templateUrl: './donate.html',
  standalone: true,
  styleUrl: './donate.scss'
})
export class Donate {
  fundraisers;

  constructor(private fundraiserService: FundraiserService) {
    this.fundraisers = toSignal(
      this.fundraiserService.get(),
      { initialValue: [] as Fundraiser[] }
    );
  }
}
