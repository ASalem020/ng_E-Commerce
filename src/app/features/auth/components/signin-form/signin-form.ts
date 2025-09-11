import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServices } from '../../services/auth.services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signin-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './signin-form.html',
  styleUrl: './signin-form.css'
})
export class SigninForm implements OnInit {
  private authService = inject(AuthServices);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  // Form data
  email = signal('');
  password = signal('');
  rememberMe = signal(false);
  isLoading = signal(false);
  showPassword = signal(false);

  // Error states
  emailError = signal('');
  passwordError = signal('');
  generalError = signal('');

  ngOnInit() {
    this.loadRememberedCredentials();
  }

  private loadRememberedCredentials() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (rememberedEmail && rememberMe) {
      this.email.set(rememberedEmail);
      this.rememberMe.set(true);
    }
  }

  togglePasswordVisibility() {
    this.showPassword.update(show => !show);
  }

  onRememberMeChange() {
    this.rememberMe.update(remember => !remember);
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateForm(): boolean {
    let isValid = true;
    
    // Reset errors
    this.emailError.set('');
    this.passwordError.set('');
    this.generalError.set('');

    // Validate email
    if (!this.email().trim()) {
      this.emailError.set('Email is required');
      isValid = false;
    } else if (!this.validateEmail(this.email().trim())) {
      this.emailError.set('Please enter a valid email address');
      isValid = false;
    }

    // Validate password
    if (!this.password().trim()) {
      this.passwordError.set('Password is required');
      isValid = false;
    } else if (this.password().length < 6) {
      this.passwordError.set('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  }

  onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading.set(true);
    this.generalError.set('');

    const userData = {
      email: this.email().trim(),
      password: this.password()
    };

    this.authService.signin(userData).subscribe({
      next: (response: any) => {
        this.isLoading.set(false);
        
        // Store user data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Handle remember me
        if (this.rememberMe()) {
          localStorage.setItem('rememberedEmail', this.email().trim());
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberMe');
        }

        this.toastr.success('Welcome back!', 'Login Successful');
        this.router.navigate(['/home']);
      },
      error: (error: any) => {
        this.isLoading.set(false);
        console.error('Signin error:', error);
        
        if (error.error?.message) {
          this.generalError.set(error.error.message);
        } else if (error.status === 401) {
          this.generalError.set('Invalid email or password');
        } else if (error.status === 0) {
          this.generalError.set('Network error. Please check your connection.');
        } else {
          this.generalError.set('An error occurred. Please try again.');
        }
        
        this.toastr.error(this.generalError(), 'Login Failed');
      }
    });
  }

  onForgotPassword() {
    this.toastr.info('Please contact support for password reset', 'Forgot Password');
  }
}
