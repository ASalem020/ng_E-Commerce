import { Routes } from '@angular/router';

export const CART_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/cart-page/cart-page').then(m => m.CartPage)

    },
    {
        path: 'checkout/',
    loadComponent: () => import('./pages/check-out/check-out').then(m => m.CheckOut)
    }
];
