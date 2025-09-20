import {Routes} from '@angular/router';
import {LayoutComponent} from './pages/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
    ]
  }
];
