import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { productsServices } from '../../services/products.services';
import { IProductData } from '../../interfaces/IGetSingleProduct';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { CartServices } from '../../../cart/services/cart.services';
import { WishlistServices } from '../../../wishlist/services/wishlist.services';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-details',
  imports: [LoadingSpinner, RouterLink, CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly productsServices = inject(productsServices);
  private readonly cartServices = inject(CartServices);
  private readonly wishlistService = inject(WishlistServices);
  private readonly toastr = inject(ToastrService);
  
  productId = this.route.snapshot.params['id'];
  product!: IProductData;
  private destroy$ = new Subject<void>();
  
  // Image selection
  selectedImage: string = '';
  currentImageIndex: number = 0;
  
  // Color and size selection
  selectedColor: string = '';
  selectedSize: string = '';
  availableColors: string[] = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];
  availableSizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  
  // Wishlist functionality
  isInWishlist: boolean = false;
  isAddingToWishlist: boolean = false;
  
  // Cart functionality
  isAddingToCart: boolean = false;

  ngOnInit(): void {
    this.getProduct();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getProduct() {
    this.productsServices.getSingleProduct(this.productId).subscribe((res) => {
      this.product = res.data;
      // Set first image as selected by default
      if (this.product.images && this.product.images.length > 0) {
        this.selectedImage = this.product.images[0];
      }
      // Check wishlist status
      this.checkWishlistStatus();
      // console.log(this.product);
    });
  }

  checkWishlistStatus() {
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

  // Image selection methods
  selectImage(image: string) {
    this.selectedImage = image;
    this.currentImageIndex = this.product.images.indexOf(image);
  }

  previousImage() {
    if (this.product.images && this.product.images.length > 0) {
      this.currentImageIndex = this.currentImageIndex > 0 
        ? this.currentImageIndex - 1 
        : this.product.images.length - 1;
      this.selectedImage = this.product.images[this.currentImageIndex];
    }
  }

  nextImage() {
    if (this.product.images && this.product.images.length > 0) {
      this.currentImageIndex = this.currentImageIndex < this.product.images.length - 1 
        ? this.currentImageIndex + 1 
        : 0;
      this.selectedImage = this.product.images[this.currentImageIndex];
    }
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

  // Color selection methods
  selectColor(color: string) {
    this.selectedColor = color;
  }

  // Size selection methods
  selectSize(size: string) {
    this.selectedSize = size;
  }

  // Wishlist functionality
  toggleWishlist() {
    if (this.isAddingToWishlist) return;

    this.isAddingToWishlist = true;

    if (this.isInWishlist) {
      this.removeFromWishlist();
    } else {
      this.addToWishlist();
    }
  }

  private addToWishlist() {
    this.wishlistService.addToWishlist(this.product.id)
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

  private removeFromWishlist() {
    this.wishlistService.removeFromWishlist(this.product.id)
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

  // Generate stars array for rating display
  getStarsArray(): number[] {
    const rating = Math.floor(this.product?.ratingsAverage || 0);
    return Array(rating).fill(0);
  }
}
