import { Routes } from '@angular/router';

export const HOME_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/user-home-page/user-home-page').then(m => m.UserHomePage)
    },
    {
        path: 'guest',
        loadComponent: () => import('./pages/guest-home-page/guest-home-page').then(m => m.GuestHomePage)
    }
];