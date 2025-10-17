import {Context} from '../validation-contexts/models';
import {Validator} from '../../../components/validators-manager/models';

export interface ValidationFlow {
  id: number
  user: { displayName: string }
  context: Context
  validators: Validator[]
}
