import { Routes } from '@angular/router';

export const AUTH_ROUTES : Routes = [
    {
        path: '',
        redirectTo: 'signin',
        pathMatch: 'full'
    },
    {
        path: 'signin',
        loadComponent: () => import('./pages/signin/signin').then(m => m.Signin)
        },
    {
        path: 'signup',
        loadComponent: () => import('./pages/signup/signup').then(m => m.Signup)
    },
    {
        path: 'forgot-password',
        loadComponent: () => import('../forget-password/forget-password').then(m => m.ForgetPassword)
    }   
]