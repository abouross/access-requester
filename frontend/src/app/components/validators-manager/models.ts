import {User} from '../user-input/models';

export interface Validator {
  id: number | string
  validator: User
  position: number
}
