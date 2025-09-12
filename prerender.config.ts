import { PrerenderConfig } from '@angular/build';

export const prerenderConfig: PrerenderConfig = {
  routes: [
    '/',
    '/home',
    '/products',
    '/categories',
    '/brands',
    '/cart',
    '/wishlist',
    '/signin',
    '/signup',
    '/forgot-password'
  ],
  discoverRoutes: false
};
