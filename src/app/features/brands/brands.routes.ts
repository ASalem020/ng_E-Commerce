import { Routes } from '@angular/router';

export const BRANDS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/brands-page/brands-page').then(m => m.BrandsPage)
    }
];
