import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistServices } from '../../services/wishlist.services';
import { CartServices } from '../../../cart/services/cart.services';
import { ToastrService } from 'ngx-toastr';
import { IWishlistData } from '../../interfaces/IGetUserWishlist';
import { Subject, takeUntil } from 'rxjs';
import { LoadingSpinner } from "../../../../shared/components/loading-spinner/loading-spinner";

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule, RouterLink, LoadingSpinner],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css'
})
export class Wishlist implements OnInit, OnDestroy {
  private wishlistService = inject(WishlistServices);
  private cartService = inject(CartServices);
  private toastr = inject(ToastrService);
  private destroy$ = new Subject<void>();

  // State management with signals
  wishlistItems = signal<IWishlistData[]>([]);
  isLoading = signal(true);
  isEmpty = signal(false);
  isClearing = signal(false);
  isRemoving = signal<string | null>(null);
  isAddingToCart = signal<string | null>(null);

  ngOnInit(): void {
    this.loadWishlist();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadWishlist(): void {
    this.isLoading.set(true);
    this.wishlistService.getWishlist()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.wishlistItems.set(response.data);
          this.isEmpty.set(response.data.length === 0);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading wishlist:', error);
          this.toastr.error('Failed to load wishlist', '', {
            positionClass: 'toast-top-right',
            timeOut: 3000,
            progressBar: true
          });
          this.isLoading.set(false);
          this.isEmpty.set(true);
        }
      });
  }

  removeFromWishlist(productId: string): void {
    if (this.isRemoving() === productId) return;

    this.isRemoving.set(productId);
    this.wishlistService.removeFromWishlist(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.wishlistItems.update(items => 
            items.filter(item => item._id !== productId)
          );
          this.isEmpty.set(this.wishlistItems().length === 0);
          this.toastr.success('Removed from wishlist', '', {
            positionClass: 'toast-top-right',
            timeOut: 3000,
            progressBar: true
          });
          this.isRemoving.set(null);
        },
        error: (error) => {
          console.error('Error removing from wishlist:', error);
          this.toastr.error('Failed to remove from wishlist', '', {
            positionClass: 'toast-top-right',
            timeOut: 3000,
            progressBar: true
          });
          this.isRemoving.set(null);
        }
      });
  }

  clearWishlist(): void {
    if (this.isClearing() || this.wishlistItems().length === 0) return;

    this.isClearing.set(true);
    // Remove all items one by one
    const removePromises = this.wishlistItems().map(item => 
      this.wishlistService.removeFromWishlist(item._id).toPromise()
    );

    Promise.all(removePromises)
      .then(() => {
        this.wishlistItems.set([]);
        this.isEmpty.set(true);
        this.toastr.success('Wishlist cleared', '', {
          positionClass: 'toast-top-right',
          timeOut: 3000,
          progressBar: true
        });
        this.isClearing.set(false);
      })
      .catch((error) => {
        console.error('Error clearing wishlist:', error);
        this.toastr.error('Failed to clear wishlist', '', {
          positionClass: 'toast-top-right',
          timeOut: 3000,
          progressBar: true
        });
        this.isClearing.set(false);
      });
  }

  addToCart(productId: string): void {
    if (this.isAddingToCart() === productId) return;

    this.isAddingToCart.set(productId);
    this.cartService.addProduct(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.toastr.success('Added to cart', '', {
            positionClass: 'toast-top-right',
            timeOut: 3000,
            progressBar: true
          });
          this.isAddingToCart.set(null);
        },
        error: (error) => {
          console.error('Error adding to cart:', error);
          this.toastr.error('Failed to add to cart', '', {
            positionClass: 'toast-top-right',
            timeOut: 3000,
            progressBar: true
          });
          this.isAddingToCart.set(null);
        }
      });
  }

  getStars(rating: number): string[] {
    const stars: string[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('full');
      } else if (i === fullStars && hasHalfStar) {
        stars.push('half');
      } else {
        stars.push('empty');
      }
    }
    
    return stars;
  }
}
