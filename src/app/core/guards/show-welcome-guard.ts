import {CanMatchFn, Router} from '@angular/router';
import {Preferences} from '@capacitor/preferences';
import {inject} from '@angular/core';

const ONBOARD_KEY = 'welcome_seen';


export const showWelcomeGuard: CanMatchFn = async () => {
  const { value } = await Preferences.get({ key: ONBOARD_KEY });
  return value !== '1';
};

export const requireWelcomeGuard: CanMatchFn = async () => {
  const router = inject(Router);
  const { value } = await Preferences.get({ key: ONBOARD_KEY });
  if (value === '1') return true;
  router.navigateByUrl('/welcome');
  return false;
};
