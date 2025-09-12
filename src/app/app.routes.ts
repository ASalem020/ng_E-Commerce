import { Routes } from '@angular/router';
import { MainLayout } from './core/layouts/main-layout/main-layout';
import { AuthLayout } from './core/layouts/auth-layout/auth-layout';
import { authGuard } from './core/guard/auth-guard';
import { userGuard } from './core/guard/user-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/signin',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    component: AuthLayout,
    canActivate: [userGuard],
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'app',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadChildren: () => import('./features/home/home.routes').then(m => m.HOME_ROUTES)
      },
      {
        path: 'checkout/:id',
        loadChildren: () => import('./features/payment/payment.routes').then(m => m.PAYMENT_ROUTES)
      },
  
      {
        path: 'products',
        loadChildren: () => import('./features/products/products.routes').then(m => m.PRODUCTS_ROUTES)
      },
      {
        path: 'categories',
        loadChildren: () => import('./features/categories/categories.routes').then(m => m.CATEGORIES_ROUTES)
      },
      {
        path: 'brands',
        loadChildren: () => import('./features/brands/brands.routes').then(m => m.BRANDS_ROUTES)
      },
      {
        path: 'cart',
        loadChildren: () => import('./features/cart/cart.routes').then(m => m.CART_ROUTES)
      },
      {
        path: 'wishlist',
        loadChildren: () => import('./features/wishlist/wishlist.routes').then(m => m.WISHLIST_ROUTES)
      },
      {
        path: 'allorders',
        loadComponent: () => import('./features/cart/pages/all-orders/all-orders').then(m => m.AllOrders)
      } 
    ]

  },
 

];
