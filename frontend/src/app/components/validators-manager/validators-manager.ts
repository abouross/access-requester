import {Component, inject, Input, OnChanges, signal, SimpleChanges} from '@angular/core';
import {MatError} from '@angular/material/input';
import {UserInput} from '../user-input/user-input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {User} from '../user-input/models';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Validator} from './models';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {
  MatDivider,
  MatList,
  MatListItem,
  MatListItemIcon,
  MatListItemLine,
  MatListItemTitle
} from '@angular/material/list';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, finalize, take, takeUntil} from 'rxjs';
import {Destroyable} from '../destroyable';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-validators-manager',
  imports: [
    MatError,
    UserInput,
    ReactiveFormsModule,
    MatButton,
    MatProgressSpinner,
    MatList,
    MatListItem,
    MatIcon,
    MatListItemIcon,
    MatListItemTitle,
    MatListItemLine,
    MatIconButton,
    MatTooltip,
    CdkDropList,
    CdkDrag,
    MatDivider,
    TranslatePipe
  ],
  templateUrl: './validators-manager.html',
  styleUrl: './validators-manager.scss'
})
export class ValidatorsManager extends Destroyable implements OnChanges {
  private _formBuilder = new FormBuilder().nonNullable
  private _http = inject(HttpClient)
  private _snackbar = inject(MatSnackBar)
  private _translate = inject(TranslateService)

  @Input() title?: string;
  @Input() backendUrl?: string;
  @Input() validators?: Validator[]

  protected errorMessage = signal('')
  protected userCtrl = signal<FormControl<User | null>>(this._formBuilder.control<User | null>({
    disabled: true,
    value: null
  }, Validators.required));
  protected loading = signal(false)
  protected usersBackendUrl = environment.apiBaseUrl + '/settings/users'

  ngOnChanges(changes: SimpleChanges) {
    this.userCtrl().reset()
    this.errorMessage.set('')
    if (changes['backendUrl']) {
      this._enableControl()
    } else
      this.userCtrl().disable()
  }

  protected addValidator() {
    if (this.userCtrl().enabled && this.userCtrl().valid && !this.loading() && this.backendUrl) {
      this.loading.set(true)
      const user = this.userCtrl().value;
      if (user && this.validators) {
        this.errorMessage.set('')
        this.userCtrl().disable()
        this._http.post<Validator>(
          this.backendUrl + '/add-validator',
          {
            validator: user.id,
            position: this.validators.length + 1
          }
        )
          .pipe(
            catchError(httpError => {
              this._updateErrorMessage(httpError);
              return []
            }),
            takeUntil(this.destroy$),
            finalize(() => {
              this.loading.set(false)
              this.userCtrl().enable()
            })
          )
          .subscribe(result => {
            if (result) {
              if (this.validators)
                this.validators.push(result)
              else
                this.validators = [result]
              this._translate.get('validators.add_success')
                .pipe(take(1))
                .subscribe(message => {
                  this._snackbar.open(
                    message,
                    'OK',
                    {panelClass: 'success-snackbar', horizontalPosition: 'end'}
                  )
                })
              this.userCtrl().reset()
            }
          })
      }
    }
  }

  protected drop($event: CdkDragDrop<any, any>) {
    if (this.validators && this.backendUrl && !this.loading()) {
      moveItemInArray(this.validators, $event.previousIndex, $event.currentIndex);
      // update superiors positions
      this.validators.forEach((validator, index) => {
        validator.position = index + 1;
      });
      const reorderFormValidators = this.validators.map(v => {
        return {validator: v.id, position: v.position};
      })
      this.loading.set(true)
      this.userCtrl().disable()
      this._http.put<Validator[]>(this.backendUrl + '/reorder-validators', {validators: reorderFormValidators})
        .pipe(
          catchError(httpError => {
            this._updateErrorMessage(httpError);
            return []
          }),
          takeUntil(this.destroy$),
          finalize(() => {
            this.loading.set(false)
            this.userCtrl().enable()
          })
        )
        .subscribe(validators => {
          this.validators = validators
        })
    }
  }

  protected displayUser(user: User) {
    return user.firstName || user.lastName ? user.firstName + ' ' + user.lastName : user.username;
  }

  protected deleteValidator(validator: Validator) {
    if (!this.loading() && this.backendUrl) {
      this.loading.set(true)
      this.userCtrl().disable()
      this.errorMessage.set('')
      this._http.delete<Validator[]>(this.backendUrl + '/delete-validator/' + validator.id)
        .pipe(
          catchError(httpError => {
            this._updateErrorMessage(httpError);
            return []
          }),
          takeUntil(this.destroy$),
          finalize(() => {
            this.loading.set(false)
            this.userCtrl().enable()
          })
        )
        .subscribe(validators => {
          this.validators = validators
        });
    }
  }

  private _enableControl() {
    if (this.backendUrl && this.backendUrl.trim().length > 0)
      this.userCtrl().enable()
  }

  private _updateErrorMessage(httpError: any) {
    if (httpError instanceof HttpErrorResponse && httpError.status === 400) {
      this.errorMessage.set(httpError.error && httpError.error.message)
    }
  }
}
