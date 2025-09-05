import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  imports: [JsonPipe],
  templateUrl: './edit.html',
  styleUrl: './edit.scss',
})
export class Edit {
  route = inject(ActivatedRoute);
}
