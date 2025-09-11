import { Routes } from "@angular/router";

export const PAYMENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./checkout-page/checkout-page').then(m => m.CheckoutPage)
  }
]