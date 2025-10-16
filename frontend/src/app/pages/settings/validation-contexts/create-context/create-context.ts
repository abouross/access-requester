import {Component, inject, signal} from '@angular/core';
import {Destroyable} from '../../../../components/destroyable';
import {MatProgressBar} from '@angular/material/progress-bar';
import {FormRow, ServerErrors} from '../../../../components/entity-form/models';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {EntityFormRows} from '../../../../components/entity-form/entity-form-rows/entity-form-rows';
import {MatButton} from '@angular/material/button';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {catchError, finalize, take, takeUntil} from 'rxjs';
import {getServerErrors} from '../../../../components/entity-form/form-utils';
import {EntityListService} from '../../../../components/entity-list/entity-list-service';

@Component({
  selector: 'app-create-context',
  imports: [
    MatProgressBar,
    ReactiveFormsModule,
    EntityFormRows,
    MatButton,
    TranslatePipe
  ],
  templateUrl: './create-context.html',
  styleUrl: '../form.scss'
})
export class CreateContext extends Destroyable {
  private _formBuilder = new FormBuilder().nonNullable
  private _http = inject(HttpClient)
  private _router = inject(Router)
  private _snackbar = inject(MatSnackBar)
  private _translate = inject(TranslateService)
  private _listService = inject(EntityListService)

  protected loading = signal(false)
  protected rows: FormRow[] = [{
    fields: [
      {field: 'name', type: 'TEXT', label: 'contexts.name', columns: 9},
      {field: 'enabled', type: 'BOOLEAN', label: 'contexts.enabled', columns: 3},
      {
        field: 'description',
        type: 'TEXTAREA',
        label: 'contexts.description',
        columns: 12,
        options: {
          textRows: 6
        }
      },
    ]
  }]
  protected formControls = {
    name: this._formBuilder.control(null, [Validators.required]),
    enabled: this._formBuilder.control(false, [Validators.required]),
    description: this._formBuilder.control(null)
  }
  protected form = this._formBuilder.group(this.formControls)
  protected serverErrors = signal<ServerErrors>({})

  protected create() {
    if (!this.loading()) {
      this.loading.set(true)
      this.form.disable()
      this.serverErrors.set({})
      this._http.post<any>(environment.apiBaseUrl + '/validation-contexts', this.form.value)
        .pipe(
          takeUntil(this.destroy$),
          catchError(error => {
            if (error instanceof HttpErrorResponse && error.status === 400) {
              this.serverErrors.set(getServerErrors(error))
            }
            throw error
          }),
          finalize(() => {
            this.loading.set(false)
            this.form.enable()
          })
        )
        .subscribe(res => {
          if (res) {
            this._translate.get('contexts.creation_success', {context: res.name})
              .pipe(take(1))
              .subscribe(message => {
                this._snackbar.open(message, 'OK', {panelClass: 'success-snackbar', horizontalPosition: 'end'});
                this._router.navigate(['/', 'settings', 'contexts', 'edit', res.id])
                  .then(() => {
                  });
              })

            this._listService.emitChangeEvent('contexts-list', {type: 'new', object: res})
          }
        })
    }
  }
}
