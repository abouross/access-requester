import {Component, inject} from '@angular/core';
import {Security} from '../../../security/security';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-flows-counts',
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    TranslatePipe
  ],
  templateUrl: './flows-counts.html',
  styleUrl: '../dashboard-card.scss'
})
export class FlowsCounts {
  protected security = inject(Security)
}
