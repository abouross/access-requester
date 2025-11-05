import {ChangeDetectorRef, Component, computed, inject, OnInit, signal} from '@angular/core';
import {EntityFormRows} from '../../../components/entity-form/entity-form-rows/entity-form-rows';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatProgressBar} from '@angular/material/progress-bar';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {EntityListService} from '../../../components/entity-list/entity-list-service';
import {Destroyable} from '../../../components/destroyable';
import {Application, getApplicationRows} from '../models';
import {ServerErrors} from '../../../components/entity-form/models';
import {catchError, concatMap, filter, finalize, take, takeUntil} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {getServerErrors} from '../../../components/entity-form/form-utils';
import {MatFormField, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-edit-application',
  imports: [
    EntityFormRows,
    MatButton,
    MatProgressBar,
    ReactiveFormsModule,
    TranslatePipe,
    MatFormField,
    MatLabel,
    MatInput,
    MatIconButton,
    MatSuffix,
    MatIcon
  ],
  templateUrl: './edit-application.html',
  styleUrl: './edit-application.scss'
})
export class EditApplication extends Destroyable implements OnInit {
  private _formBuilder = new FormBuilder().nonNullable
  private _http = inject(HttpClient)
  private _translate = inject(TranslateService)
  protected _snackbar = inject(MatSnackBar)
  private _router = inject(Router)
  private _listService = inject(EntityListService)
  private _activatedRoute = inject(ActivatedRoute)
  private _cd = inject(ChangeDetectorRef)

  protected loading = signal(false)
  protected rows = getApplicationRows(this._http, this.destroy$)
  protected serverErrors = signal<ServerErrors>({})
  protected formControls = signal({})
  protected form = computed(() => this._formBuilder.group(this.formControls()))
  protected application = signal<Application | undefined>(undefined)

  ngOnInit() {
    this._activatedRoute.paramMap
      .pipe(
        takeUntil(this.destroy$),
        filter(params => params.has('id')),
        concatMap(params => {
          const id = params.get('id')
          if (!id)
            throw new Error('Application id not found !')
          this.loading.set(true)
          return this._http.get<Application>(environment.apiBaseUrl + '/applications/' + id)
            .pipe(
              takeUntil(this.destroy$),
              finalize(() => this.loading.set(false))
            )
        })
      )
      .subscribe(application => {
        if (application) {
          this.formControls.set({
            name: this._formBuilder.control(application.name, [Validators.required, Validators.minLength(2)]),
            validationContext: this._formBuilder.control(application.context.id, [Validators.required]),
            enabled: this._formBuilder.control(application.enabled, [Validators.required]),
            description: this._formBuilder.control(application.description, [Validators.minLength(5)]),
          })
          this.application.set(application)
        }
      })
  }

  protected update() {
    if (!this.loading() && this.application()) {
      this.loading.set(true)
      this.form().disable()
      this.serverErrors.set({})
      this._http.put<Application>(environment.apiBaseUrl + '/applications/' + this.application()?.id, this.form().value)
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
        .subscribe(updated => {
          if (updated) {
            this._translate.get('applications.update_success', {application: updated.name})
              .pipe(take(1))
              .subscribe(message => {
                this._snackbar.open(message, 'OK', {panelClass: 'success-snackbar', horizontalPosition: 'end'});
              })
            // notify list for new entity
            this._listService.emitChangeEvent('applications-list', {type: 'update', object: updated})
            this.application.set(updated)
          }
        })
    }
  }

  /**
   * Add new role
   * @param roleInput
   * @protected
   */
  protected addRole(roleInput: HTMLInputElement) {
    if (!roleInput.disabled && this.application()) {
      roleInput.disabled = true
      this._http.post<void>(environment.apiBaseUrl + '/applications/' + this.application()?.id + '/roles', roleInput.value)
        .pipe(
          takeUntil(this.destroy$),
          catchError(httpError => {
            if (httpError instanceof HttpErrorResponse && httpError.status === 400 && httpError.error && httpError.error.message) {
              this._snackbar.open(httpError.error.message, 'OK', {
                panelClass: 'error-snackbar',
                horizontalPosition: 'end'
              })
            }
            throw httpError;
          }),
          finalize(() => {
            roleInput.disabled = false
            this._cd.markForCheck()
          })
        )
        .subscribe(() => {
          this.application.update(app => {
            if (app)
              app.roles.push(roleInput.value)
            return app;
          })
          this._translate.get('applications.role.add_success', {role: roleInput.value})
            .pipe(take(1))
            .subscribe(message => {
              this._snackbar.open(message, 'OK', {
                panelClass: 'success-snackbar',
                horizontalPosition: 'end',
                duration: 3000
              });
            })

          roleInput.value = ''
        })
    }
  }

  protected removeRole(role: string, deleteButton: MatIconButton) {
    deleteButton.disabled = true
    this._http.delete<void>(environment.apiBaseUrl + '/applications/' + this.application()?.id + '/roles/' + encodeURI(role))
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => deleteButton.disabled = false),
      )
      .subscribe(() => {
        this.application.update(app => {
          if (app) {
            app.roles.splice(app.roles.indexOf(role), 1)
          }
          return app
        })
        this._translate.get('applications.role.remove_success', {role: role})
          .pipe(take(1))
          .subscribe(message => {
            this._snackbar.open(message, 'OK', {
              panelClass: 'success-snackbar',
              horizontalPosition: 'end',
              duration: 3000
            });
          })

      })
  }
}
