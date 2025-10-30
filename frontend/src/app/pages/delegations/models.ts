import {User} from '../../components/user-input/models';

export interface UserDelegations {
  id: number
  username: string
  email: string
  firstName?: string
  lastName?: string
  title?: string
  department?: string
  delegations?: Delegation[]
}

export interface Delegation {
  id: number
  delegatedUser: User
  startDate: Date | string
  endDate: Date | string
}
