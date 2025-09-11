import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgetPasswordServices } from './services/forget-password.services';
import { ToastrService } from 'ngx-toastr';
import { ToastrModule } from 'ngx-toastr';
import { timer } from 'rxjs';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-forget-password',
  imports: [CommonModule, ToastrModule, FormsModule],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css'
})
export class ForgetPassword {
  // inject the forget password service
  private forgetPasswordService = inject(ForgetPasswordServices);
  // inject the toastr service
  private toastr = inject(ToastrService);
  // inject the router
  private router = inject(Router);
  // email variable
  email!: string;
  // is loading variable
  isLoading: boolean = false;
  // success message variable
  successMessage!: string;

  // error message variable
  errorMessage!: string;
  
  // reset password function
  resetPassword() {
    this.isLoading = true;
    
    // Validate email
    if (!this.email || !this.isValidEmail(this.email)) {
      this.toastr.error('Please enter a valid email address');
      this.isLoading = false;
      return;
    }
    
    this.forgetPasswordService.resetPassword(this.email).subscribe({
      next: (res: any) => {
        this.successMessage = res.message as string;
        this.toastr.success(this.successMessage);
        timer(3000).subscribe(() => {
          this.router.navigate(['/signin']);
        }); 
      },
      error: (err: any) => {
        this.errorMessage = err.message as string;
        this.toastr.error(this.errorMessage);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Email validation helper function
  private isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }


}
