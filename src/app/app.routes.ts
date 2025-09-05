import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'welcome',
  },
  {
    path: 'map',
    loadComponent: () => import('./pages/map-fires/components/map/map').then((m) => m.Map),
  },
  {
    path: 'welcome',
    loadComponent: () => import('./pages/welcome/welcome').then((m) => m.Welcome),
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth-module').then((m) => m.AuthModule),
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile-module').then((m) => m.ProfileModule),
  },
  {
    path: 'become-volunteer',
    loadComponent: () =>
      import('./pages/become-volunteer/become-volunteer').then((m) => m.BecomeVolunteer),
  },
];
