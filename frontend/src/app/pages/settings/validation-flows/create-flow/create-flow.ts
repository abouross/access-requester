import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {MatProgressBar} from "@angular/material/progress-bar";
import {Destroyable} from '../../../../components/destroyable';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Context} from '../../validation-contexts/models';
import {ActivatedRoute, Router} from '@angular/router';
import {BehaviorSubject, catchError, filter, finalize, switchMap, take, takeUntil} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {EntityFormRows} from '../../../../components/entity-form/entity-form-rows/entity-form-rows';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {FormRow, SelectOption, ServerErrors} from '../../../../components/entity-form/models';
import {getServerErrors} from '../../../../components/entity-form/form-utils';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EntityListService} from '../../../../components/entity-list/entity-list-service';
import {MatError} from '@angular/material/input';

@Component({
  selector: 'app-create-flow',
  imports: [
    MatProgressBar,
    EntityFormRows,
    FormsModule,
    MatButton,
    TranslatePipe,
    ReactiveFormsModule,
    MatError
  ],
  templateUrl: './create-flow.html',
  styleUrl: '../form.scss'
})
export class CreateFlow extends Destroyable implements OnInit {
  private _http = inject(HttpClient)
  private _activatedRoute = inject(ActivatedRoute)
  private _formBuilder = new FormBuilder().nonNullable
  private _contextsOptionsSubject = new BehaviorSubject<SelectOption[]>([])
  private _snackbar = inject(MatSnackBar)
  private _entityListService = inject(EntityListService)
  private _router = inject(Router)
  private _translation = inject(TranslateService)


  protected loading = signal(false)
  protected contexts = signal<Context[]>([])
  protected context = signal<Context | undefined>(undefined)
  protected formControls = signal<{ [field: string]: FormControl } | undefined>(undefined)
  protected form = computed<FormGroup<any>>(() => {
    const controls = this.formControls()
    if (controls)
      return this._formBuilder.group(controls)
    return this._formBuilder.group({})
  })
  protected serverErrors = signal<ServerErrors>({})
  protected serverError = signal('')
  protected rows: FormRow[] = [
    {
      fields: [
        {
          field: 'user',
          type: 'USER',
          label: 'flows.user',
          columns: 6,
          options: {userBackendUrl: environment.apiBaseUrl + '/settings/users'}
        },
        {
          field: 'context',
          type: 'SELECT',
          label: 'flows.context',
          columns: 6,
          options: {selectOptions: this._contextsOptionsSubject.asObservable()}
        },
      ]
    }
  ]

  ngOnInit() {
    this._init()
  }

  private _init() {
    // Load selected context
    this._activatedRoute.paramMap
      .pipe(
        takeUntil(this.destroy$),
        filter(params => params.has('contextId')),
        switchMap(params => {
          const contextId = params.get('contextId')
          if (!contextId)
            throw new Error(' Context id is null')
          this.loading.set(true)
          return this._http.get<any>(environment.apiBaseUrl + '/validation-contexts/' + contextId)
            .pipe(finalize(() => this.loading.set(false)))
        })
      )
      .subscribe(context => {
        if (context) {
          this.context.set(context)
          const controls = {
            user: this._formBuilder.control(null, Validators.required),
            context: this._formBuilder.control({value: context.id, disabled: true}, Validators.required),
          }
          this.formControls.set(controls)
        }
      })
    // Load contexts list
    this._http.get<Context[]>(environment.apiBaseUrl + '/validation-contexts/actives')
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(result => {
        if (result) {
          const options = result.map(c => {
            return {label: c.name, value: c.id} as SelectOption
          })
          this._contextsOptionsSubject.next(options)
        }
      })
  }

  protected create() {
    if (!this.loading()) {
      this.loading.set(true)
      this.form().disable()
      this.serverErrors.set({})
      this.serverError.set('')
      const value = this.form().value
      this._http.post<any>(environment.apiBaseUrl + '/validation-flows', {
        user: value.user.id,
        context: value.context
      })
        .pipe(
          takeUntil(this.destroy$),
          catchError(error => {
            if (error instanceof HttpErrorResponse && error.status === 400) {
              this.serverErrors.set(getServerErrors(error))
              if (error.error.message)
                this.serverError.set(error.error.message)
            }
            throw error
          }),
          finalize(() => {
            this.loading.set(false);
            this.form().enable()
          })
        )
        .subscribe(result => {
          if (result) {
            this._translation.get('flows.creation_success', {flow: result.user.displayName})
              .pipe(take(1))
              .subscribe(message => {
                this._snackbar.open(
                  message,
                  'OK',
                  {panelClass: 'success-snackbar', horizontalPosition: 'end'}
                )
              })
            this._entityListService.emitChangeEvent('flow-list', {type: "new", object: result})
            this._router.navigate(['/', 'settings', 'flows', 'edit', this.context()?.id, result.id])
              .then(() => {
              })
          }
        })
    }
  }
}
