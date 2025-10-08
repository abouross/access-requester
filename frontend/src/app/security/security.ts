import {inject, Injectable} from '@angular/core';
import {JwtToken, Profile} from './models';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {BehaviorSubject, finalize, Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Security {
  private _token?: JwtToken
  private _http = inject(HttpClient)
  private _router = inject(Router)
  private _profileSubject = new BehaviorSubject<Profile | undefined>(undefined)

  get profile$(): Observable<Profile | undefined> {
    if (!this._profileSubject.value)
      this.updateProfile()
    return this._profileSubject.asObservable()
  }

  get token() {
    return this._token
  }

  constructor() {
    const token = localStorage.getItem(environment.tokenStorageKey);
    if (token !== null)
      this._token = new JwtToken(token);
  }

  updateProfile() {
    this._http.get<Profile>(environment.apiBaseUrl + '/profile')
      .subscribe(profile => this._profileSubject.next(profile));
  }

  hasRoleOrAdmin(requireRole: string) {
    if (!this._token || !this._token.roles)
      return false
    return this._token.roles.some(role => [requireRole, 'ADMIN'].includes(role))
  }

  isAuthenticated(): boolean {
    return this._token instanceof JwtToken && this._token.isValid()
  }

  login(credentials: { username: string, password: string }): Observable<{ token: string }> {
    return this._http.post<{ token: string }>(environment.apiBaseUrl + '/login', {
      username: credentials.username,
      password: credentials.password
    })
      .pipe(
        tap(result => {
          this._token?.clear();
          this._token = new JwtToken(result.token)
          this._token.persist()
        })
      )
  }

  logout() {
    this._http.get(environment.apiBaseUrl + '/logout')
      .pipe(
        finalize(() => {
          this._token?.clear()
          this._token = undefined
          this._router.navigateByUrl('/login')
            .then(() => {
            })
        })
      ).subscribe(() => {
    });
  }
}
