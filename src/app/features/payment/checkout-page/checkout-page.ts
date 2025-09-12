import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentServices } from '../services/pay.services';
import { CommonModule } from '@angular/common';
import { log } from 'console';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout-page',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css'
})
export class CheckoutPage {
  // inject the activated route
  router = inject(Router);
  toastr = inject(ToastrService);
  paymentService = inject(PaymentServices);
  cartId = inject(ActivatedRoute).snapshot.params['id'];
  fb = inject(FormBuilder); 

  // Loading states
  isProcessingCOD = false;
  isProcessingOnline = false;

  paymentForm: FormGroup = this.fb.group({
    details: ['', [Validators.required, Validators.minLength(10)]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]{10,15}$/)]],
    city: ['', [Validators.required, Validators.minLength(2)]],
  });

  payment(type: string) {
    // Mark all fields as touched to show validation errors
    this.paymentForm.markAllAsTouched();
    
    if (this.paymentForm.invalid) {
      // console.log('Form is invalid');
      return;
    }

    // console.log(this.paymentForm.value);
    // console.log(this.cartId);
    // console.log(type);

    if (type === 'cod') {
      this.isProcessingCOD = true;
      this.paymentService.codPayment({shippingAddress: {...this.paymentForm.value}}, this.cartId).subscribe({
        next: (res: any) => {
          // console.log(res);
          // console.log(this.cartId);
          this.isProcessingCOD = false;
          this.toastr.success('Cash On Delivery Payment Successful');
          this.router.navigate(['/app/home']);
        },
        error: (error) => {
          console.error('Cash On Delivery  Payment Error:', error);
          this.isProcessingCOD = false;
          this.toastr.error('Cash On Delivery Payment Failed');
          
          // You can add a toast notification here
        }
      });
    } else if (type === 'online') {
      this.isProcessingOnline = true;
      this.paymentService.onlinePayment({shippingAddress: {...this.paymentForm.value}}, this.cartId).subscribe({
        next: (res: any) => {
          // console.log(res);
          this.isProcessingOnline = false;
          this.toastr.success('Online Payment Successful');
          this.router.navigate(['/app/home']);
          if (res.session?.url) {
            window.open(res.session.url, '_self');
          }
          // Handle online payment response
        },
        error: (error) => {
          console.error('Online Payment Error:', error);
          this.isProcessingOnline = false;
          this.toastr.error('Online Payment Failed');
          this.router.navigate(['/app/home']);
          // You can add a toast notification here
        }
      });
    }
  }

  // Helper method to check if a field has errors
  hasFieldError(fieldName: string): boolean {
    const field = this.paymentForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Helper method to get error message for a field
  getFieldErrorMessage(fieldName: string): string {
    const field = this.paymentForm.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    if (field.errors['required']) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field.errors['minlength']) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    if (field.errors['pattern']) {
      return `Please enter a valid ${fieldName}`;
    }
    return '';
  }
}
