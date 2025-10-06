import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges
} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {TranslatePipe} from '@ngx-translate/core';
import {FormBuilder, FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {AsyncPipe, Location} from '@angular/common';
import {FormConfig} from './models';
import {Destroyable} from '../destroyable';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, finalize, Observable, takeUntil} from 'rxjs';
import {MatProgressBar} from '@angular/material/progress-bar';

@Component({
  selector: 'app-entity-form',
  imports: [
    TranslatePipe,
    MatButton,
    MatIconButton,
    MatIcon,
    ReactiveFormsModule,
    MatError,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    AsyncPipe,
    MatOption,
    MatSlideToggle,
    MatProgressBar
  ],
  templateUrl: './entity-form.html',
  styleUrl: './entity-form.scss'
})
export class EntityForm extends Destroyable implements OnChanges {
  private _formBuilder = new FormBuilder().nonNullable
  private _location = inject(Location)
  private _http = inject(HttpClient)

  @Input() cardTitle?: string
  @Input() config?: FormConfig
  @Output() entity = new EventEmitter<any>()

  protected _cardTitle = signal('')
  protected loading = signal(false)
  protected formControls = signal<{ [key: string]: FormControl } | undefined>(undefined)
  protected form = computed(() => {
    const controls = this.formControls()
    if (controls) {
      return this._formBuilder.group(controls)
    }
    return this._formBuilder.group({})
  })
  protected serverErrors = signal<{ [field: string]: string[] }>({})
  protected serverError = signal('')

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config'] && changes['config'].currentValue) {
      this._initConfig()
    }

    if (changes['cardTitle'] && this.cardTitle) {
      this._cardTitle.set(this.cardTitle)
    }
  }

  protected back() {
    this._location.back();
  }

  protected submit() {
    if (!this.loading() && this.config) {
      this.loading.set(true);
      this.form().disable()
      this.serverErrors.set({})
      this.serverError.set('')

      let observable: Observable<Object> | null = null;

      if (this.config.formType === 'CREATE')
        observable = this._http.post(this.config.backendUrl, this.form().value)
      if (this.config.formType === 'EDIT')
        observable = this._http.put(this.config.backendUrl, this.form().value)
      if (observable !== null)
        observable.pipe(
          takeUntil(this.destroy$),
          catchError(httpError => {
            if (httpError instanceof HttpErrorResponse && httpError.status === 400) {
              if (Array.isArray(httpError.error)) {
                const errors: { [field: string]: string[] } = {}
                httpError.error.forEach(error => {
                  if (errors[error.field] && Array.isArray(errors[error.field])) {
                    errors[error.field].push(error.message)
                  } else {
                    errors[error.field] = [error.message]
                  }
                })
                this.serverErrors.set(errors)
              } else if (httpError.error && httpError.error.message)
                this.serverError.set(httpError.error.message)
            }
            throw httpError
          }),
          finalize(() => {
            this.loading.set(false);
            this.form().enable()
          })
        )
          .subscribe(result => {
            if (this.config && this.config.postSubmit) {
              this.config.postSubmit(result)
            }
          })
    }
  }

  private _initConfig() {
    this.loading.set(false)
    this.serverError.set('')
    this.serverErrors.set({})
    this.ngOnDestroy()
    const controls: { [key: string]: FormControl } = {}
    if (this.config && this.config.formType === 'CREATE') {
      if (this.config && this.config.rows) {
        for (const row of this.config.rows) {
          for (const field of row.fields) {
            controls[field.field] = this._formBuilder.control(field.defaultValue || null, field.validators)
          }
        }
      }
      this.formControls.set(controls)
    } else if (this.config && this.config.formType === 'EDIT') {
      this.loading.set(true)
      this._http.get<any>(this.config.backendUrl)
        .pipe(takeUntil(this.destroy$), finalize(() => this.loading.set(false)))
        .subscribe(entity => {
          if (entity) {
            this.entity.emit(entity)
            if (this.config && this.config.rows) {
              for (const row of this.config.rows) {
                for (const field of row.fields) {
                  controls[field.field] = this._formBuilder.control(entity[field.field], field.validators)
                }
              }
            }
            this.formControls.set(controls)
          }
        })
    }
  }
}
