import { Component, inject, OnInit } from '@angular/core';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { CartServices } from '../../services/cart.services';
import { UserCartData } from '../../interfaces/IGetUserCart';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart-page',
  imports: [LoadingSpinner, CommonModule, FormsModule],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css'
})
export class CartPage implements OnInit {
  // Injected services
  cartServices = inject(CartServices);
  router = inject(Router);
  toastr = inject(ToastrService);

  // State variables
  cart!: UserCartData;
  isLoading = true;
  error: string | null = null;
  successMessage: string | null = null;
  removingItemId: string | null = null;
  updatingQuantityId: string | null = null;

  ngOnInit(): void {
    this.getCart();
  }

  getCart() {
    this.isLoading = true;
    this.error = null;
    this.successMessage = null;
    
    this.cartServices.getCart().subscribe({
      next: (res) => {
        this.cart = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching cart:', err);
        this.error = 'Failed to load cart items';
        this.isLoading = false;
        this.toastr.error('Failed to load cart items');
      }
    });
  }

  updateQuantity(productId: string, newQuantity: number) {
    if (newQuantity < 1) {
      this.removeItem(productId);
      return;
    }

    this.updatingQuantityId = productId;
    this.error = null;
    this.successMessage = null;

    this.cartServices.updateQuantity(productId, newQuantity).subscribe({
      next: (res) => {
        // Update local cart data
        const product = this.cart.products.find(p => p.product.id === productId);
        if (product) {
          product.count = newQuantity;
        }
        this.cart.totalCartPrice = res.data.totalCartPrice;
        this.updatingQuantityId = null;
        this.toastr.success('Quantity updated successfully');
      },
      error: (err) => {
        console.error('Error updating quantity:', err);
        this.error = 'Failed to update quantity';
        this.updatingQuantityId = null;
        this.toastr.error('Failed to update quantity');
      }
    });
  }

  removeItem(productId: string) {
    this.removingItemId = productId;
    this.error = null;
    this.successMessage = null;

    this.cartServices.deleteProduct(productId).subscribe({
      next: () => {
        
        // Remove item from local cart data
        this.cart.products = this.cart.products.filter(p => p.product.id !== productId);
        this.calculateTotalPrice();
        
        if (this.cart.products.length === 0) {
          this.cart = {} as UserCartData;
        }
        
        this.removingItemId = null;
        this.successMessage = 'Item removed from cart';
        this.toastr.success('Item removed from cart');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        console.error('Error removing item:', err);
        this.error = 'Failed to remove item';
        this.removingItemId = null;
        this.toastr.error('Failed to remove item');
      }
    });
  }

  clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartServices.clearCart().subscribe({
        next: () => {
          this.cart = {} as UserCartData;
          this.successMessage = 'Cart cleared successfully';
          this.toastr.success('Cart cleared successfully');
          
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error: (err) => {
          console.error('Error clearing cart:', err);
          this.error = 'Failed to clear cart';
          this.toastr.error('Failed to clear cart');
        }
      });
    }
  }

  proceedToCheckout() {
    
    this.router.navigate(['/app/checkout/', this.cart._id]);

  }

  continueShopping() {
    this.router.navigate(['/app/products']);
  }

  private calculateTotalPrice() {
    this.cart.totalCartPrice = this.cart.products.reduce((total, item) => {
      return total + (item.price * item.count);
    }, 0);
  }

  // Getters for template
  get hasItems(): boolean {
    return this.cart && this.cart.products && this.cart.products.length > 0;
  }

  get totalItems(): number {
    return this.cart?.products?.reduce((total, item) => total + item.count, 0) || 0;
  }

  get subtotal(): number {
    return this.cart?.totalCartPrice || 0;
  }

  get tax(): number {
    return this.subtotal * 0.1; // 10% tax
  }

  get shipping(): number {
    return this.subtotal > 100 ? 0 : 10; // Free shipping over $100
  }

  get total(): number {
    return this.subtotal + this.tax + this.shipping;
  }
}