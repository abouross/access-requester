import {Component, EventEmitter, HostBinding, inject, Input, Output, signal} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {Destroyable} from '../destroyable';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BooleanInput, convertToBoolProperty, User} from './models';
import {takeUntil} from 'rxjs';
import {UserDialog} from './user-dialog/user-dialog';

@Component({
  selector: 'app-user-input',
  imports: [
    MatIcon,
    MatTooltip
  ],
  templateUrl: './user-input.html',
  styleUrl: './user-input.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: UserInput
  }]
})
export class UserInput extends Destroyable implements ControlValueAccessor {
  private _http = inject(HttpClient)
  private _dialog = inject(MatDialog)

  /* Disable state */
  @Input()
  @HostBinding('class.disabled')
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = convertToBoolProperty(value);
  }

  protected _disabled = false;
  static ngAcceptInputType_disabled: BooleanInput;
  /* End disable state */
  @Input() placeholder ?: string
  @Input() backendUrl?: string

  @Output() userChange = new EventEmitter<User | null>()

  protected user = signal<User | null>(null)
  protected onChange = (value: User | null) => {
  };
  protected onTouched = () => {
  };
  protected touched = false;

  protected unselectUser() {
    if (this.user() && !this._disabled) {
      this._markAsTouched()
      if (!this._disabled) {
        this.user.set(null)
        this.onChange(this.user())
        this.userChange.emit(this.user())
      }
    }
  }

  protected displayUser() {
    const user = this.user()
    if (user) {
      return user.firstName || user.lastName ?
        user.firstName + ' ' + user.lastName : user.username
    }
    return ''
  }

  protected usersDialog() {
    if (!this._disabled) {
      this._dialog.open(UserDialog, {minWidth: '800px', data: {backendUrl: this.backendUrl}})
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(selected => {
          this._markAsTouched()
          if (!this._disabled && selected) {
            this.user.set(selected)
            this.onChange(this.user())
            this.userChange.emit(this.user())
          }
        })
    }
  }

  writeValue(obj: any): void {
    if (obj && typeof obj !== 'object' && typeof obj !== 'string' && typeof obj !== 'number' && (!obj.id || !obj.username))
      throw new Error("Please provide a valid user object");
    if (typeof obj === 'string' || typeof obj === 'number')
      this._http.get<User>(this.backendUrl + '/' + obj)
        .pipe(
          takeUntil(this.destroy$),
        )
        .subscribe(result => {
          this.user.set(result)
        })
    else
      this.user.set(obj)
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  private _markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }
}
