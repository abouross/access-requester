import {Validator} from '../../../components/validators-manager/models';

export interface Context {
  id: number | string
  name: string
  enabled: boolean
  description?: string
  validators?: Validator[]
}
