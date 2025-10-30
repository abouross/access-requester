import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {MatProgressBar} from '@angular/material/progress-bar';
import {Destroyable} from '../../../components/destroyable';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError, concatMap, filter, finalize, take, takeUntil} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {Delegation, UserDelegations} from '../models';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {UserInput} from '../../../components/user-input/user-input';
import {MatError, MatFormField, MatHint, MatLabel, MatSuffix} from '@angular/material/input';
import {
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker,
  MatEndDate,
  MatStartDate
} from '@angular/material/datepicker';
import {DateAdapter} from '@angular/material/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {User} from '../../../components/user-input/models';
import {ServerErrors} from '../../../components/entity-form/models';
import {getServerErrors} from '../../../components/entity-form/form-utils';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-delegation',
  imports: [
    MatProgressBar,
    TranslatePipe,
    DatePipe,
    MatIconButton,
    MatIcon,
    MatTooltip,
    MatFormField,
    MatLabel,
    UserInput,
    MatDateRangeInput,
    MatDatepickerToggle,
    MatDateRangePicker,
    MatStartDate,
    MatEndDate,
    MatSuffix,
    MatHint,
    ReactiveFormsModule,
    MatButton,
    MatError,
  ],
  providers: [DatePipe],
  templateUrl: './edit-delegation.html',
  styleUrl: './edit-delegation.scss'
})
export class EditDelegation extends Destroyable implements OnInit {
  private _http = inject(HttpClient)
  private _activatedRoute = inject(ActivatedRoute)
  private _translate = inject(TranslateService)
  private _adapter = inject<DateAdapter<unknown, unknown>>(DateAdapter);
  private _formBuilder = new FormBuilder().nonNullable
  private _snackBar = inject(MatSnackBar)
  private _datePipe = inject(DatePipe)

  protected loading = signal(false)
  protected userDelegations = signal<UserDelegations | undefined>(undefined)
  protected localeId = signal(this._translate.getCurrentLang())
  protected readonly dateFormatString = computed(() => {
    if (this.localeId() === 'en') {
      return 'MM/DD/YYYY';
    } else if (this.localeId() === 'fr') {
      return 'DD/MM/YYYY';
    }
    return '';
  });
  protected form = this._formBuilder.group({
    delegatedUserId: this._formBuilder.control(null, [Validators.required]),
    startDate: this._formBuilder.control(null, [Validators.required]),
    endDate: this._formBuilder.control(null, [Validators.required]),
  })
  protected usersBackendUrl = environment.apiBaseUrl + '/delegations/users';
  protected formError = signal('')
  protected formErrors = signal<ServerErrors>({})

  ngOnInit() {
    this._init()
  }

  private _init() {
    // User id change
    this._activatedRoute.paramMap
      .pipe(
        takeUntil(this.destroy$),
        filter(params => params.has('userId')),
        concatMap(params => {
          const userId = params.get('userId')
          if (!userId)
            throw new Error('Unable to find user id')
          this.loading.set(true)
          return this._http.get<UserDelegations>(environment.apiBaseUrl + '/delegations/user/' + userId)
            .pipe(
              takeUntil(this.destroy$),
              finalize(() => this.loading.set(false))
            )
        })
      )
      .subscribe(userDelegations => {
        if (userDelegations) {
          this.userDelegations.set(userDelegations)
        }
      })

    // Set date adapter locale
    this._adapter.setLocale(this.localeId())

    // Locale change
    this._translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(langChange => {
        this.localeId.set(langChange.lang)
        this._adapter.setLocale(this.localeId());
      })
  }

  protected isDeletable(delegation: Delegation) {
    const now = Date.now()
    return delegation && new Date(delegation.endDate).getTime() > now
  }

  protected create() {
    if (!this.loading()) {
      this.loading.set(true)
      this.form.disable()
      this.formErrors.set({})
      const value = this.form.value as {
        delegatedUserId: User | null,
        startDate: Date | null,
        endDate: Date | null
      }

      this._http.post<UserDelegations>(
        environment.apiBaseUrl + '/delegations/user/' + this.userDelegations()?.id,
        {
          delegatedUserId: value.delegatedUserId?.id,
          startDate: this._datePipe.transform(value.startDate, 'yyyy-MM-dd'),
          endDate: this._datePipe.transform(value.endDate, 'yyyy-MM-dd')
        })
        .pipe(
          takeUntil(this.destroy$),
          catchError(httpError => {
            if (httpError instanceof HttpErrorResponse && httpError.status === 400) {
              this.formErrors.set(getServerErrors(httpError))
              if (httpError.error && httpError.error.message)
                this.formError.set(httpError.error.message)
            }
            throw httpError
          }),
          finalize(() => {
            this.loading.set(false);
            this.form.enable()
          })
        )
        .subscribe(userDelegations => {
          if (userDelegations) {
            this.userDelegations.set(userDelegations)
            this._translate.get('delegations.creation_success')
              .pipe(take(1))
              .subscribe(message => {
                this._snackBar.open(message, 'OK', {panelClass: 'success-snackbar', horizontalPosition: 'end'})
              })
          }
        })
    }
  }

  protected delete(delegation: Delegation) {
    if (delegation) {
      this.loading.set(true)
      this._http.delete(environment.apiBaseUrl + '/delegations/' + delegation.id)
        .pipe(
          takeUntil(this.destroy$),
          catchError(httpError => {
            if (httpError instanceof HttpErrorResponse && httpError.status === 400 && httpError.error && httpError.error.message) {
              this._snackBar.open(httpError.error.message, 'OK', {
                panelClass: 'error-snackbar',
                horizontalPosition: 'end'
              })
            }
            throw httpError
          }),
          finalize(() => this.loading.set(false))
        )
        .subscribe(() => {
          this._translate.get('delegations.delete_success', {delegation: delegation.delegatedUser.displayName})
            .pipe(take(1))
            .subscribe(message => {
              this._snackBar.open(message, 'OK', {panelClass: 'success-snackbar', horizontalPosition: 'end'})
            })

          this.userDelegations.update(userDelegations => {
            userDelegations?.delegations
              ?.splice(
                userDelegations?.delegations?.findIndex(elt => elt.id === delegation.id),
                1
              )
            return userDelegations
          })
        })
    }
  }
}
