import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Security {
  hasRoleOrAdmin(requireRole: string) {
    return true
  }
}
