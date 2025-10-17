import {Component, inject, OnInit, signal} from '@angular/core';
import {Destroyable} from '../../../../components/destroyable';
import {HttpClient} from '@angular/common/http';
import {ValidationFlow} from '../models';
import {MatProgressBar} from '@angular/material/progress-bar';
import {environment} from '../../../../../environments/environment';
import {ActivatedRoute} from '@angular/router';
import {filter, finalize, switchMap, takeUntil} from 'rxjs';
import {TranslatePipe} from '@ngx-translate/core';
import {ValidatorsManager} from '../../../../components/validators-manager/validators-manager';
import {Validator} from '../../../../components/validators-manager/models';

@Component({
  selector: 'app-edit-flow',
  imports: [
    MatProgressBar,
    TranslatePipe,
    ValidatorsManager
  ],
  templateUrl: './edit-flow.html',
  styleUrl: './edit-flow.scss'
})
export class EditFlow extends Destroyable implements OnInit {
  private _http = inject(HttpClient)
  private _activatedRoute = inject(ActivatedRoute)

  protected loading = signal(false)
  protected flow = signal<ValidationFlow | undefined>(undefined)

  ngOnInit() {
    this._init()
  }

  private _init() {
    this._activatedRoute.paramMap
      .pipe(
        takeUntil(this.destroy$),
        filter(params => params.has('id')),
        switchMap(params => {
          const id = params.get('id')
          if (!id)
            throw new Error('Validation flow id not found')
          this.loading.set(true)
          return this._http.get<ValidationFlow>(environment.apiBaseUrl + '/validation-flows/' + id)
            .pipe(finalize(() => this.loading.set(false)))
        })
      )
      .subscribe(flow => {
        if (flow) {
          this.flow.set(flow)
        }
      })

  }

  protected getValidatorUrl() {
    if (this.flow())
      return environment.apiBaseUrl + '/validation-flows/' + this.flow()?.id
    return undefined;
  }

  protected getValidators() {
    return (this.flow()?.validators as Validator[]) || [];
  }
}
