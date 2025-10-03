import {Component, inject, OnInit} from '@angular/core';
import {EntityForm} from '../../../components/entity-form/entity-form';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {FormConfig, SelectOption} from '../../../components/entity-form/models';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map, Subject, take, takeUntil} from 'rxjs';
import {Destroyable} from '../../../components/destroyable';
import {Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-user',
  imports: [
    EntityForm,
    TranslatePipe
  ],
  templateUrl: './create-user.html',
  styleUrl: './create-user.scss'
})
export class CreateUser extends Destroyable implements OnInit {
  private _http = inject(HttpClient)
  private _translate = inject(TranslateService)
  private _router = inject(Router)
  private _snackBar = inject(MatSnackBar)
  private _rolesMapOptionsSubject: Subject<SelectOption[]> = new Subject<SelectOption[]>()

  formConfig: FormConfig = {
    backendUrl: environment.apiBaseUrl + '/users',
    rows: [
      {
        fields: [
          {
            field: 'firstName',
            type: 'TEXT',
            label: 'user.firstName',
            columns: 6,
            validators: [Validators.minLength(1), Validators.maxLength(200)]
          },
          {
            field: 'lastName',
            type: 'TEXT',
            label: 'user.lastName',
            columns: 6,
            validators: [Validators.minLength(1), Validators.maxLength(200)]
          },
          {
            field: 'username',
            type: 'TEXT',
            label: 'user.username',
            columns: 6,
            validators: [Validators.required, Validators.minLength(2), Validators.maxLength(100)]
          },
          {
            field: 'email',
            type: 'TEXT',
            label: 'user.email',
            columns: 6,
            validators: [Validators.email, Validators.required, Validators.minLength(2), Validators.maxLength(100)],
            options: {textType: 'email'}
          },
          {
            field: 'roles',
            type: 'SELECT',
            label: 'user.roles',
            columns: 6,
            validators: [],
            options: {
              selectOptions: this._rolesMapOptionsSubject.asObservable(),
              selectMultiple: true
            }
          },
          {
            field: 'password',
            type: 'TEXT',
            label: 'user.password',
            columns: 6,
            validators: [Validators.required, Validators.minLength(6), Validators.maxLength(200)],
            options: {textType: 'password'}
          },
          {field: 'title', type: 'TEXT', label: 'user.title', columns: 6, validators: []},
          {field: 'department', type: 'TEXT', label: 'user.department', columns: 6, validators: []},
          {
            field: 'enabled',
            type: 'BOOLEAN',
            label: 'user.enabled',
            columns: 6,
            validators: [Validators.required],
            defaultValue: true
          }
        ]
      }
    ],
    idPrefix: 'user_',
    postSubmit: result => {
      this._translate.get('user.create_success_message', {user: result.displayName})
        .pipe(take(1))
        .subscribe(message => {
          this._snackBar.open(message, 'OK', {panelClass: 'success-snackbar'});
          this._router.navigateByUrl('/users/edit/' + result.id)
            .then(() => {
            });
        });
    }
  };

  ngOnInit() {
    this._getRolesMap()

    this._translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this._getRolesMap()
      })
  }

  private _getRolesMap() {
    this._http.get<{
      [key: string]: string
    }>(environment.apiBaseUrl + '/users/roles-map')
      .pipe(
        takeUntil(this.destroy$),
        map(rolesMap => {
          return Object.keys(rolesMap)
            .map(key => {
              return {label: rolesMap[key], value: key}
            })
        })
      )
      .subscribe(rolesMap => {
        this._rolesMapOptionsSubject.next(rolesMap);
      })
  }

}
