import {Routes} from '@angular/router';
import {Layout} from './layout/layout';
import {environment} from '../environments/environment';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(c => c.Dashboard)},
      {
        path: 'error/:code',
        loadComponent: () => import('./pages/error/error').then(c => c.Error),
        title: (route) => `Erreur ${route.params['code']} - ${environment.appName}`
      },
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: '**', redirectTo: 'error/404', pathMatch: 'full'}
    ]
  }
];
