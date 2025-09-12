import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { STORED_KEYS } from "../constants/storedKeys";

export const userGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Check if we're running in a browser environment
  if (isPlatformBrowser(platformId)) {
    const token = STORED_KEYS.TOKEN;
    if (token) {
      return router.parseUrl('/app/home');
    } else {
      return true; // Allow access to auth routes
    }
  } else {
    // On server side, allow access to auth routes
    return true;
  }
};
