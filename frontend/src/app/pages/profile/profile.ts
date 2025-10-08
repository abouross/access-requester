import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {
  MatCard, MatCardActions,
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {AsyncPipe, KeyValuePipe, NgOptimizedImage} from '@angular/common';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Destroyable} from '../../components/destroyable';
import {MatProgressBar} from '@angular/material/progress-bar';
import {LoadingProgressService} from '../../components/loading-progress/loading-progress.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {catchError, finalize, map, Observable, shareReplay, take, takeUntil} from 'rxjs';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Security} from '../../security/security';

export interface UserDetails {
  id: number
  username: string
  firstName: string
  lastName: string
  enabled: boolean
  displayName: string
  email: string
  title: string
  department: string
  roles: string[]
}

@Component({
  selector: 'app-profile',
  imports: [
    MatGridList,
    MatGridTile,
    MatCard,
    MatCardHeader,
    NgOptimizedImage,
    MatCardAvatar,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    TranslatePipe,
    MatProgressBar,
    MatIconButton,
    MatIcon,
    MatCardActions,
    MatButton,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    KeyValuePipe,
    AsyncPipe
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile extends Destroyable implements OnInit {
  private _loadingService = inject(LoadingProgressService)
  private _http = inject(HttpClient)
  private _formBuilder = new FormBuilder().nonNullable
  private _breakpointObserver = inject(BreakpointObserver)
  private _snackbar = inject(MatSnackBar)
  private _translate = inject(TranslateService)
  private _security = inject(Security)

  protected loading = signal(false)
  protected user = signal<UserDetails | undefined>(undefined)
  protected formControls = signal<{ [key: string]: FormControl }>({})
  protected form = computed<FormGroup>(() => this._formBuilder.group(this.formControls()))
  protected serverErrors = signal<{ [field: string]: string[] }>({})
  protected isHandset$: Observable<boolean> = this._breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    )
  protected passwordControls = signal<{ oldPassword: FormControl, newPassword: FormControl }>({
    oldPassword: this._formBuilder.control(null, [Validators.required, Validators.minLength(6), Validators.maxLength(100)]),
    newPassword: this._formBuilder.control(null, [Validators.required, Validators.minLength(6), Validators.maxLength(100)])
  })
  protected passwordForm = computed(() => this._formBuilder.group(this.passwordControls()))
  protected passwordServerError = signal('')
  protected passwordServerErrors = signal<{ [field: string]: string[] }>({})

  ngOnInit() {
    this._loadingService.setAutoMode(false)
    this.loadUser();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._loadingService.setAutoMode(true)
  }

  protected loadUser() {
    if (!this.loading()) {
      this.loading.set(true);
      this._http.get<UserDetails>(environment.apiBaseUrl + '/profile-details')
        .pipe(takeUntil(this.destroy$), finalize(() => this.loading.set(false)))
        .subscribe(details => {
          if (details) {
            this.user.set(details)
            this.formControls.set({})
            this.formControls.set({
              firstName: this._formBuilder.control(details.firstName, [Validators.minLength(2), Validators.maxLength(200)]),
              lastName: this._formBuilder.control(details.lastName, [Validators.minLength(2), Validators.maxLength(200)]),
              username: this._formBuilder.control(details.username, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
              email: this._formBuilder.control(details.email, [Validators.required, Validators.email, Validators.minLength(2), Validators.maxLength(100)]),
            })
          }
        })
    }
  }

  protected save() {
    if (!this.loading()) {
      this._preSubmit()
      this._http.put<UserDetails>(environment.apiBaseUrl + '/profile-details', this.form().value)
        .pipe(
          takeUntil(this.destroy$),
          catchError((httpError) => {
            if (httpError instanceof HttpErrorResponse && httpError.status === 400) {
              if (Array.isArray(httpError.error)) {
                const errors = this.serverErrors()
                httpError.error.forEach(error => {
                  if (errors[error.field] && Array.isArray(errors[error.field])) {
                    errors[error.field].push(error.message)
                  } else {
                    errors[error.field] = [error.message]
                  }
                })

                this.serverErrors.set(errors)
              }

            }
            throw httpError
          }),
          finalize(() => this._postSubmit())
        )
        .subscribe(userDetails => {
          if (userDetails) {
            this.user.set(userDetails)
            this._security.updateProfile()
            this._translate.get('profile.update_success')
              .pipe(take(1))
              .subscribe(successMessage => {
                if (successMessage) {
                  this._snackbar.open(successMessage, 'OK', {panelClass: 'success-snackbar'})
                }
              })
          }
        })
    }
  }

  protected changePassword() {
    if (!this.loading()) {
      this._preSubmit()
      this._http.put<UserDetails>(environment.apiBaseUrl + '/change-password', this.passwordForm().value)
        .pipe(
          takeUntil(this.destroy$),
          catchError((httpError) => {
            if (httpError instanceof HttpErrorResponse && httpError.status === 400) {
              if (Array.isArray(httpError.error)) {
                const errors = this.passwordServerErrors()
                httpError.error.forEach(error => {
                  if (errors[error.field] && Array.isArray(errors[error.field])) {
                    errors[error.field].push(error.message)
                  } else {
                    errors[error.field] = [error.message]
                  }
                })

                this.passwordServerErrors.set(errors)
              } else if (httpError.error && httpError.error.message)
                this.passwordServerError.set(httpError.error.message)
            }
            throw httpError
          }),
          finalize(() => this._postSubmit())
        )
        .subscribe(userDetails => {
          this.passwordForm().reset()
          this._translate.get('profile.password_update_success')
            .pipe(take(1))
            .subscribe(successMessage => {
              if (successMessage) {
                this._snackbar.open(successMessage, 'OK', {panelClass: 'success-snackbar'})
              }
            })
        })
    }
  }

  private _preSubmit() {
    this.loading.set(true);
    this.form().disable()
    this.passwordForm().disable()
    this.serverErrors.set({})
    this.passwordServerErrors.set({})
    this.passwordServerError.set('')
  }

  private _postSubmit() {
    this.loading.set(false);
    this.form().enable()
    this.passwordForm().enable()
  }
}
