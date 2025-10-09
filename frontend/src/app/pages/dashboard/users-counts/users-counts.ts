import {Component, inject, Input, OnInit, signal} from '@angular/core';
import {Destroyable} from '../../../components/destroyable';
import {Security} from '../../../security/security';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {finalize, takeUntil} from 'rxjs';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {GroupedResult} from '../models';
import {MatIconButton} from '@angular/material/button';
import {TranslatePipe} from '@ngx-translate/core';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-users-counts',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatIcon,
    MatCardContent,
    MatProgressSpinner,
    MatIconButton,
    MatTooltip,
    TranslatePipe
  ],
  templateUrl: './users-counts.html',
  styleUrl: '../dashboard-card.scss'
})
export class UsersCounts extends Destroyable implements OnInit {
  @Input() set orientation(value: 'vertical' | 'horizontal' | null) {
    if (value)
      this._orientation.set(value);
  }

  protected _orientation = signal<'vertical' | 'horizontal'>('horizontal')
  protected security = inject(Security)
  protected counts = signal<GroupedResult[] | undefined>(undefined)
  protected loading = signal<boolean>(false)
  private _http = inject(HttpClient)

  ngOnInit() {
    this.refresh()
  }

  protected refresh() {
    if (!this.loading()) {
      this.loading.set(true)
      this._http.get<GroupedResult[]>(environment.apiBaseUrl + '/users/counts')
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.loading.set(false))
        )
        .subscribe(counts => {
          this.counts.set(counts);
        })
    }
  }

  protected getFontSizeClasses(count?: number) {
    if (count) {
      const stringLength = String(count).length;
      return {small: stringLength >= 3, medium: stringLength === 2, large: stringLength === 1};
    }
    return {}
  }

  getStatusClass(grouped: GroupedResult) {
    if (grouped.groupKey === 'enabled') {
      return 'success'
    }

    if (grouped.groupKey === 'disabled') {
      return 'error'
    }

    if (grouped.groupKey === 'all') {
      return 'info'
    }
    return ''
  }
}
