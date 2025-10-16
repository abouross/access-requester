import {ValidatorFn} from '@angular/forms';
import {Observable} from 'rxjs';

export interface FormConfig {
  backendUrl: string
  rows: FormRow[]
  formType: FormType
  idPrefix?: string
  postSubmit?: (result: any) => void
}

export interface FormRow {
  fields: FormField[]
}

export interface FormField {
  field: string
  type: FieldType
  label: string
  columns: number
  validators?: ValidatorFn | ValidatorFn[]
  defaultValue?: any
  options?: {
    textRows?: number
    selectOptions?: Observable<SelectOption[]>
    selectMultiple?: boolean
    textType?: 'text' | 'number' | 'email' | 'password' | 'url'
    userBackendUrl?: string
  }
}

export type FieldType = 'TEXT' | 'BOOLEAN' | 'SELECT' | 'TEXTAREA' | 'USER'

export interface SelectOption {
  label: string
  value: any
}

export type FormType = 'CREATE' | 'EDIT'

export interface ServerErrors {
  [field: string]: string[]
}
