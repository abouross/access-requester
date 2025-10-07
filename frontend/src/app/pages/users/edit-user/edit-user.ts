import {Component, inject, OnInit, signal} from '@angular/core';
import {EntityForm} from '../../../components/entity-form/entity-form';
import {Destroyable} from '../../../components/destroyable';
import {LoadingProgressService} from '../../../components/loading-progress/loading-progress.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BehaviorSubject, filter, map, take, takeUntil} from 'rxjs';
import {FormConfig, SelectOption} from '../../../components/entity-form/models';
import {environment} from '../../../../environments/environment';
import {Validators} from '@angular/forms';
import {UserService} from '../user-service';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-edit-user',
  imports: [
    EntityForm,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.scss'
})
export class EditUser extends Destroyable implements OnInit {
  private _loadingProgress = inject(LoadingProgressService)
  private _translate = inject(TranslateService)
  private _snackBar = inject(MatSnackBar)
  private _rolesMapOptionsSubject = new BehaviorSubject<SelectOption[]>([])
  private _activatedRoute = inject(ActivatedRoute)
  private _userService = inject(UserService)
  private _router = inject(Router)
  private _entity: any

  protected cardTitle = signal('')
  protected formConfig = signal<FormConfig | undefined>(undefined)

  ngOnInit() {
    this._loadingProgress.setAutoMode(false)
    // Retrieve role map
    this._updateRolesMap()

    this._translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this._updateRolesMap()
      })

    // Init config when id
    this._updateFormConfig()
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._loadingProgress.setAutoMode(true)
  }

  private _updateRolesMap() {
    this._userService.getRolesMap()
      .pipe(takeUntil(this.destroy$))
      .subscribe(rolesMap => this._rolesMapOptionsSubject.next(rolesMap))
  }

  private _updateFormConfig() {
    this._activatedRoute.paramMap
      .pipe(
        takeUntil(this.destroy$),
        filter(params => params.has('id') && params.get('id') !== null),
        map(params => params.get('id')),
      )
      .subscribe(id => {
        const formConfig: FormConfig = {
          backendUrl: environment.apiBaseUrl + '/users/' + id,
          formType: 'EDIT',
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
                  validators: [Validators.minLength(6), Validators.maxLength(200)],
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
            this._translate.get('user.update_success_message', {user: result.displayName})
              .pipe(take(1))
              .subscribe(message => {
                this._snackBar.open(message, 'OK', {panelClass: 'success-snackbar'});
              })

            this._updateCardTitle(result)
          }
        }
        this.formConfig.set(formConfig)
      })
  }

  protected onEntity(entity: any) {
    this._entity = entity;
    this._updateCardTitle(entity);
  }

  private _updateCardTitle(entity: any) {
    if (entity) {
      this._translate.get('user.update_title', {user: entity.displayName})
        .pipe(take(1))
        .subscribe(title => this.cardTitle.set(title))
    }
  }

  protected delete() {
    if (this._entity) {
      const subscription = this._userService.deleteUser(
        this._entity,
        environment.apiBaseUrl + '/users/' + this._entity.id,
        {message: 'user.deletion_confirmation', args: {'user': this._entity.username}},
        {message: 'user.delete_success_message', args: {'user': this._entity.username}}
      ).subscribe(deleted => {
        if (deleted)
          this._router.navigateByUrl('/users')
            .then(() => {
            });
        subscription.unsubscribe()
      })
    }
  }
}
