import {Context} from '../settings/validation-contexts/models';
import {environment} from '../../../environments/environment';
import {map, Subject, takeUntil} from 'rxjs';
import {FormRow, SelectOption} from '../../components/entity-form/models';
import {HttpClient} from '@angular/common/http';

export const getContextsOptions = (http: HttpClient, destroy$: Subject<void>) => http.get<Context[]>(environment.apiBaseUrl + '/applications/contexts')
  .pipe(
    takeUntil(destroy$),
    map(contexts => contexts.map(context => {
      return {label: context.name, value: context.id} as SelectOption
    }))
  )

export const getApplicationRows = (http: HttpClient, destroy$: Subject<void>): FormRow[] => [
  {
    fields: [
      {field: 'name', type: 'TEXT', label: 'applications.name', columns: 6},
      {
        field: 'validationContext',
        type: 'SELECT',
        label: 'applications.context',
        columns: 6,
        options: {
          selectOptions: getContextsOptions(http, destroy$)
        }
      },
      {
        field: 'description',
        type: 'TEXTAREA',
        label: 'applications.description',
        columns: 12,
        options: {
          textRows: 6
        }
      },
      {field: 'enabled', type: 'BOOLEAN', label: 'applications.enabled', columns: 2},
    ]
  }
]


export interface Application {
  id: number,
  name: string,
  context: Context,
  description: string,
  enabled: boolean,
  roles: string[]
}
