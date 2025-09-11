import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  // Cart state
  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  // Wishlist state
  private wishlistCountSubject = new BehaviorSubject<number>(0);
  public wishlistCount$ = this.wishlistCountSubject.asObservable();

  // Cart methods
  updateCartCount(count: number): void {
    this.cartCountSubject.next(count);
  }

  getCartCount(): number {
    return this.cartCountSubject.value;
  }

  // Wishlist methods
  updateWishlistCount(count: number): void {
    this.wishlistCountSubject.next(count);
  }

  getWishlistCount(): number {
    return this.wishlistCountSubject.value;
  }

  // Reset methods (useful for logout)
  resetCartCount(): void {
    this.cartCountSubject.next(0);
  }

  resetWishlistCount(): void {
    this.wishlistCountSubject.next(0);
  }

  // Reset all
  resetAll(): void {
    this.resetCartCount();
    this.resetWishlistCount();
  }
}
