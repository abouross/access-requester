import {Component, inject, signal} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Destroyable} from '../../components/destroyable';
import {MatError, MatFormField, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {AsyncPipe} from '@angular/common';
import {AppearanceService} from '../../appearance/appearance-service';
import {MatTooltip} from '@angular/material/tooltip';
import {MatProgressBar} from '@angular/material/progress-bar';
import {environment} from '../../../environments/environment';
import {Security} from '../../security/security';
import {catchError, finalize, take, takeUntil} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatIconButton,
    MatIcon,
    MatCardActions,
    MatButton,
    MatSuffix,
    AsyncPipe,
    MatTooltip,
    MatProgressBar,
    MatError
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  providers: [AppearanceService]
})
export class Login extends Destroyable {
  private _fb = new FormBuilder().nonNullable
  private _translate = inject(TranslateService)
  private _security = inject(Security)
  private _snackBar = inject(MatSnackBar)
  private _router = inject(Router)

  protected controls = {
    username: this._fb.control(null, [Validators.required, Validators.minLength(2)]),
    password: this._fb.control(null, [Validators.required, Validators.minLength(6)])
  }
  protected form = this._fb.group(this.controls);
  protected loading = signal(false)
  protected hidePassword = signal(true);
  protected appearanceService = inject(AppearanceService)
  protected currentLanguage = signal(this._translate.getCurrentLang())
  protected errorMessage = signal('')
  protected fieldErrorMessage = signal<{ [key: string]: string }>({username: '', password: ''})
  protected hasRemoteErrors = signal<boolean>(false)

  protected login() {
    if (this.form.valid && !this.loading()) {
      this.loading.set(true);
      this.form.disable()
      this.errorMessage.set('')
      this.hasRemoteErrors.set(false)
      const credentials = this.form.value;

      this._security.login({username: credentials.username || '', password: credentials.password || ''})
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => {
            this.form.enable()
            this.loading.set(false)
          }),
          catchError(httpError => {
            if (httpError instanceof HttpErrorResponse && httpError.status === 400 && httpError.error.message) {
              if (!httpError.error.errors)
                this.errorMessage.set(httpError.error.message)
              else if (Array.isArray(httpError.error.errors)) {
                this.hasRemoteErrors.set(true);
                this.fieldErrorMessage.update(error => {
                  httpError.error.errors.forEach((errorField: any) => {
                    error[errorField.field] = errorField.defaultMessage
                  });
                  return error;
                });
              }
              return []
            }

            throw httpError;
          })
        )
        .subscribe(() => {
          this._translate.get('login.success_message')
            .pipe(take(1))
            .subscribe(message => {
              this._snackBar.open(message, 'OK', {
                duration: 5 * 1000,
                panelClass: 'success-snackbar'
              })
            })

          const redirectUrl = localStorage.getItem(environment.lastPathStorageKey);
          if (redirectUrl !== null && redirectUrl !== '')
            this._router.navigateByUrl(redirectUrl)
              .then(() => {
              })
        })

    }
  }

  protected togglePassword($event: PointerEvent) {
    this.hidePassword.set(!this.hidePassword());
    $event.stopPropagation();
  }

  protected readonly environment = environment;

  langChange($event: Event) {
    const lang = ($event.target as HTMLSelectElement).value
    if (lang && lang.trim().length > 0)
      this._translate.use(lang)
  }
}
