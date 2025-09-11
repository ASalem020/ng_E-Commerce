import { Component, inject, Input, OnInit, OnDestroy } from '@angular/core';
import { IProductsData } from '../../interfaces/IGetAllProducts';
import { RouterLink } from '@angular/router';
import { CartServices } from '../../../cart/services/cart.services';
import { WishlistServices } from '../../../wishlist/services/wishlist.services';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-card',
  imports: [RouterLink, CommonModule],
  templateUrl: './card.html',
  styleUrl: './card.css'
})
export class Card implements OnInit, OnDestroy {
  private readonly toastr = inject(ToastrService);
  private readonly wishlistService = inject(WishlistServices);
  cartServices = inject(CartServices);

  @Input() product!: IProductsData;
  @Input() viewMode: 'grid' | 'list' = 'grid';
  
  // State management
  isAddingToCart = false;
  isAddingToWishlist = false;
  isInWishlist = false;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.checkWishlistStatus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addToCart(productId: string) {
    if (this.isAddingToCart) return;
    
    this.isAddingToCart = true;
    this.cartServices.addProduct(productId).subscribe({
      next: (res) => {
        // console.log(res);
        this.toastr.success('Product added to cart', '', {
          positionClass: 'toast-top-right',
          timeOut: 3000,
          progressBar: true
        });
        this.isAddingToCart = false;
      },
      error: (err) => {
        // console.log(err);
        this.toastr.error('Failed to add product to cart', '', {
          positionClass: 'toast-top-right',
          timeOut: 3000,
          progressBar: true
        });
        this.isAddingToCart = false;
      }
    });
  }

  toggleWishlist(productId: string) {
    if (this.isAddingToWishlist) return;

    this.isAddingToWishlist = true;

    if (this.isInWishlist) {
      this.removeFromWishlist(productId);
    } else {
      this.addToWishlist(productId);
    }
  }

  private addToWishlist(productId: string) {
    this.wishlistService.addToWishlist(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isInWishlist = true;
          this.isAddingToWishlist = false;
          this.toastr.success('Added to wishlist', '', {
            positionClass: 'toast-top-right',
            timeOut: 3000,
            progressBar: true
          });
          this.triggerHeartAnimation(productId);
        },
        error: (err) => {
          console.error('Error adding to wishlist:', err);
          this.isAddingToWishlist = false;
          this.toastr.error('Failed to add to wishlist', '', {
            positionClass: 'toast-top-right',
            timeOut: 3000,
            progressBar: true
          });
        }
      });
  }

  private removeFromWishlist(productId: string) {
    this.wishlistService.removeFromWishlist(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isInWishlist = false;
          this.isAddingToWishlist = false;
          this.toastr.info('Removed from wishlist', '', {
            positionClass: 'toast-top-right',
            timeOut: 3000,
            progressBar: true
          });
        },
        error: (err) => {
          console.error('Error removing from wishlist:', err);
          this.isAddingToWishlist = false;
          this.toastr.error('Failed to remove from wishlist', '', {
            positionClass: 'toast-top-right',
            timeOut: 3000,
            progressBar: true
          });
        }
      });
  }

  private checkWishlistStatus() {
    this.wishlistService.isInWishlist(this.product.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (isInWishlist) => {
          this.isInWishlist = isInWishlist;
        },
        error: (err) => {
          console.error('Error checking wishlist status:', err);
          this.isInWishlist = false;
        }
      });
  }

  private triggerHeartAnimation(productId: string) {
    const button = document.querySelector(`[data-product-id="${productId}"]`) as HTMLElement;
    if (button) {
      button.classList.add('heart-beat');
      setTimeout(() => {
        button.classList.remove('heart-beat');
      }, 1300);
    }
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
