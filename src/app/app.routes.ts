import { Routes } from '@angular/router';
import {requireWelcomeGuard, showWelcomeGuard} from './core/guards/show-welcome-guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'map' },

  {
    path: 'welcome',
    loadComponent: () =>
      import('./pages/welcome/welcome').then((m) => m.Welcome),
    canMatch: [showWelcomeGuard],
  },
  {
    path: 'map',
    loadComponent: () =>
      import('./pages/map-fires/components/map/map').then((m) => m.Map),
    canMatch: [requireWelcomeGuard],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth-module').then((m) => m.AuthModule),
    canMatch: [requireWelcomeGuard],
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./pages/profile/profile-module').then((m) => m.ProfileModule),
    canMatch: [requireWelcomeGuard],
  },
  {
    path: 'become-volunteer',
    loadComponent: () =>
      import('./pages/become-volunteer/become-volunteer').then((m) => m.BecomeVolunteer),
    canMatch: [requireWelcomeGuard],
  },

  { path: '**', redirectTo: 'map' },
];
