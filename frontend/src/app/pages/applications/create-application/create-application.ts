import {Component, inject, signal} from '@angular/core';
import {EntityFormRows} from "../../../components/entity-form/entity-form-rows/entity-form-rows";
import {MatButton} from "@angular/material/button";
import {MatProgressBar} from "@angular/material/progress-bar";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {Destroyable} from '../../../components/destroyable';
import {ServerErrors} from '../../../components/entity-form/models';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {getApplicationRows} from '../models';
import {environment} from '../../../../environments/environment';
import {catchError, finalize, take, takeUntil} from 'rxjs';
import {getServerErrors} from '../../../components/entity-form/form-utils';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {EntityListService} from '../../../components/entity-list/entity-list-service';

@Component({
  selector: 'app-create-application',
  imports: [
    EntityFormRows,
    MatButton,
    MatProgressBar,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './create-application.html',
})
export class CreateApplication extends Destroyable {
  private _formBuilder = new FormBuilder().nonNullable
  private _http = inject(HttpClient)
  private _translate = inject(TranslateService)
  protected _snackbar = inject(MatSnackBar)
  private _router = inject(Router)
  private _listService = inject(EntityListService)

  protected loading = signal(false)
  protected formControls = {
    name: this._formBuilder.control(null, [Validators.required, Validators.minLength(2)]),
    validationContext: this._formBuilder.control(null, [Validators.required]),
    enabled: this._formBuilder.control(true, [Validators.required]),
    description: this._formBuilder.control(null, [Validators.minLength(5)]),
  }
  protected rows = getApplicationRows(this._http, this.destroy$)
  protected form = this._formBuilder.group(this.formControls)
  protected serverErrors = signal<ServerErrors>({})

  protected create() {
    if (!this.loading()) {
      this.loading.set(true)
      this.form.disable()
      this.serverErrors.set({})
      this._http.post<any>(environment.apiBaseUrl + '/applications', this.form.value)
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
        .subscribe(created => {
          if (created) {
            this._translate.get('applications.creation_success', {application: created.name})
              .pipe(take(1))
              .subscribe(message => {
                this._snackbar.open(message, 'OK', {panelClass: 'success-snackbar', horizontalPosition: 'end'});
                this._router.navigate(['/', 'applications', 'edit', created.id])
                  .then(() => {
                  });
              })
            // notify list for new entity
            this._listService.emitChangeEvent('applications-list', {type: 'new', object: created})
          }
        })
    }
  }
}
