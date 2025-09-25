import {Component, inject, Input, OnChanges, OnInit, signal, SimpleChanges} from '@angular/core';
import {MatProgressBar} from '@angular/material/progress-bar';
import {Destroyable} from '../destroyable';
import {LoadingProgressService} from './loading-progress.service';
import {takeUntil} from 'rxjs';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

@Component({
  selector: 'app-loading-progress',
  imports: [MatProgressBar],
  templateUrl: './loading-progress.html',
  styleUrl: './loading-progress.scss',
})
export class LoadingProgress extends Destroyable implements OnInit, OnChanges {
  @Input() autoMode: boolean = true;

  protected mode = signal<'determinate' | 'indeterminate'>('indeterminate');
  protected progress = signal<number>(0);
  protected show = signal<boolean>(false);

  private _service = inject(LoadingProgressService);

  ngOnInit() {
    // Subscribe to the service
    this._service.mode$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.mode.set(value);
      });

    this._service.progress$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.progress.set(value);
      });

    this._service.show$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.show.set(value);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    // Auto mode
    if ('autoMode' in changes) {
      // Set the auto mode in the service
      this._service.setAutoMode(coerceBooleanProperty(changes['autoMode'].currentValue));
    }
  }
}
