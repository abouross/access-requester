export interface User {
  id: number
  username: string
  email: string
  firstName?: string
  lastName?: string
  title?: string
  department?: string
  displayName: string
}


export const convertToBoolProperty = (val: any): boolean => {
  if (typeof val === 'string') {
    val = val.toLowerCase().trim();

    return val === 'true' || val === '';
  }
  return !!val;
}

export type NullableInput = string | null | undefined;
export type BooleanInput = boolean | NullableInput;
