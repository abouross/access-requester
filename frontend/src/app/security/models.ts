import {environment} from '../../environments/environment';

export interface Profile {
  username: string
  firstName: string
  lastName: string
  displayName: string
  title: string
  email: string
}

const parseToken = (token: string) => {
  const parts = token.split('.');
  const encodedPayload = parts[1];
  return JSON.parse(atob(encodedPayload)) as { sub: string, iat: number, exp: number, roles: string[] };
}

export class JwtToken {
  private _token: string
  private _username: string
  private _iat: number
  private _iatDate: Date
  private _exp: number
  private _expDate: Date
  private _roles: string[]

  constructor(token: string) {
    if (!token || token.trim() === '')
      throw Error('Invalid jwt token: ' + token)
    this._token = token
    const tokenObject = parseToken(token)
    this._username = tokenObject.sub
    this._iat = tokenObject.iat
    this._iatDate = new Date(0)
    this._iatDate.setUTCSeconds(this._iat)
    this._exp = tokenObject.exp
    this._expDate = new Date(0)
    this._expDate.setUTCSeconds(this._exp)
    this._roles = tokenObject.roles
  }

  get token(): string {
    return this._token
  }

  get username(): string {
    return this._username
  }

  get expiredAt(): number {
    return this._exp
  }

  get expiredAtDate(): Date {
    return this._expDate
  }

  get issuedAt(): number {
    return this._iat
  }

  get issuedAtDate(): Date {
    return this._iatDate
  }

  get roles() {
    return this._roles;
  }

  isValid(): boolean {
    return new Date() < this._expDate
  }

  clear() {
    localStorage.removeItem(environment.tokenStorageKey)
  }

  persist() {
    localStorage.setItem(environment.tokenStorageKey, this._token)
  }
}
