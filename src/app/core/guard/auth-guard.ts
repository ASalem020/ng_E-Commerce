import { inject, PLATFORM_ID } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { isPlatformBrowser } from "@angular/common";
import { jwtDecode } from "jwt-decode";
import { STORED_KEYS } from "../constants/storedKeys";

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Check if we're running in a browser environment
  if (isPlatformBrowser(platformId)) {
    const token = STORED_KEYS.TOKEN;
    
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // console.log(decodedToken);
        // localStorage.setItem('userId', decodedToken);
        return true; // Allow access to protected routes
      } catch (error) {
        return router.parseUrl('/auth/signin');
      }
    } else {
      return router.parseUrl('/auth/signin');
    }
  } else {
    // On server side, redirect to signin
    return router.parseUrl('/auth/signin');
  }
};