import {HttpErrorResponse} from '@angular/common/http';
import {ServerErrors} from './models';


export const getServerErrors = (httpError: HttpErrorResponse): ServerErrors => {
  const errors: ServerErrors = {}
  if (httpError.status === 400 && Array.isArray(httpError.error)) {
    httpError.error.forEach(error => {
      if (errors[error.field] && Array.isArray(errors[error.field])) {
        errors[error.field].push(error.message)
      } else {
        errors[error.field] = [error.message]
      }
    })
  }
  return errors
}
