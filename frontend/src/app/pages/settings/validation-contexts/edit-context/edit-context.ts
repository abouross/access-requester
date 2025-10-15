import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {Destroyable} from '../../../../components/destroyable';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {EntityListService} from '../../../../components/entity-list/entity-list-service';
import {FormRow, ServerErrors} from '../../../../components/entity-form/models';
import {catchError, filter, finalize, switchMap, take, takeUntil} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {EntityFormRows} from '../../../../components/entity-form/entity-form-rows/entity-form-rows';
import {MatButton} from '@angular/material/button';
import {MatProgressBar} from '@angular/material/progress-bar';
import {KeyValuePipe} from '@angular/common';
import {getServerErrors} from '../../../../components/entity-form/form-utils';
import {ValidatorsManager} from '../../../../components/validators-manager/validators-manager';
import {Validator} from '../../../../components/validators-manager/models';

@Component({
  selector: 'app-edit-context',
  imports: [
    EntityFormRows,
    MatButton,
    MatProgressBar,
    ReactiveFormsModule,
    TranslatePipe,
    KeyValuePipe,
    ValidatorsManager
  ],
  templateUrl: './edit-context.html',
  styleUrls: ['../form.scss', './edit-context.scss']
})
export class EditContext extends Destroyable implements OnInit {
  private _activatedRoute = inject(ActivatedRoute)
  private _formBuilder = new FormBuilder().nonNullable
  private _http = inject(HttpClient)
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
  protected formControls = signal<{ [key: string]: FormControl }>({})
  protected form = computed(() => this._formBuilder.group(this.formControls()))
  protected serverErrors = signal<ServerErrors>({})
  protected entity?: any

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
            throw new Error(' Context id is null')
          this.loading.set(true)
          return this._http.get<any>(environment.apiBaseUrl + '/validation-contexts/' + id)
            .pipe(finalize(() => this.loading.set(false)))
        })
      )
      .subscribe(entity => {
        if (entity) {
          this.entity = entity
          this.loading.set(false)
          this.serverErrors.set({})
          const controls = {
            name: this._formBuilder.control(entity.name, [Validators.required]),
            enabled: this._formBuilder.control(entity.enabled, [Validators.required]),
            description: this._formBuilder.control(entity.description)
          }
          this.formControls.set(controls)
        }
      })
  }

  protected update() {
    if (!this.loading() && this.entity) {
      this.loading.set(true)
      this.serverErrors.set({})
      this.form().disable()
      this._http.put<any>(environment.apiBaseUrl + '/validation-contexts/' + this.entity.id, this.form().value)
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
            this.form().enable()
          })
        )
        .subscribe(res => {
          if (res) {
            this._translate.get('contexts.update_success', {context: res.name})
              .pipe(take(1))
              .subscribe(message => {
                this._snackbar.open(message, 'OK', {panelClass: 'snackbar-success', horizontalPosition: 'end'});
              })
            this._listService.emitChangeEvent('contexts-list', {type: 'update', object: res})
          }
        })
    }
  }

  protected getValidatorUrl() {
    if (this.entity)
      return environment.apiBaseUrl + '/validation-contexts/' + this.entity.id
    return undefined;
  }

  protected getValidators() {
    return (this.entity && this.entity.validators as Validator[]) || [];
  }
}
