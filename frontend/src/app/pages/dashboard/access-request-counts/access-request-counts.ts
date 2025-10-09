import {Component, Input} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-access-request-counts',
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    TranslatePipe,
  ],
  templateUrl: './access-request-counts.html',
  styleUrl: '../dashboard-card.scss'
})
export class AccessRequestCounts {
  @Input() public all: boolean = false;
}
