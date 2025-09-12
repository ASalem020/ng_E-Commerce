import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthServices } from '../../services/auth.services';
import { HttpErrorResponse } from '@angular/common/http';
import { timer } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signin-form',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './signin-form.html',
  styleUrl: './signin-form.css'
})
export class SigninForm implements OnInit {
  // variables
  isLoading: boolean = false;
  errorMessage!: string | undefined;
  successMessage!: string | undefined;

  // inject the auth service and router
  private authService = inject(AuthServices);
  private router = inject(Router);
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    // Check if user is already logged in (check both localStorage and sessionStorage)
    const persistentToken = localStorage.getItem('token');
    const sessionToken = sessionStorage.getItem('token');
    
    if (persistentToken || sessionToken) {
      this.router.navigate(['/app/home']);
    }
    
    // Initialize remember me functionality
    this.initializeRememberMe();
  }

  // Enhanced signin form with validation
  signinForm = this.fb.group({
    email: ['', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(6)
    ]],
    rememberMe: [false]
  });

  onSubmit() {
    this.handlebeforeSubmit();
    
    // Only submit if form is valid
    if (this.signinForm.valid) {
      const email = this.signinForm.get('email')?.value;
      const password = this.signinForm.get('password')?.value;
      
      if (email && password) {
        const formData = {
          email: email,
          password: password
        };
        
        this.authService.signin(formData).subscribe({
          next: (res: any) => {
            // console.log('Signin successful:', res);
            
            // Store token based on remember me setting
            if (this.signinForm.get('rememberMe')?.value) {
              // If remember me is checked, store in localStorage (persistent)
              localStorage.setItem('token', res.token);
            } else {
              // If remember me is not checked, store in sessionStorage (temporary)
              sessionStorage.setItem('token', res.token);
              localStorage.removeItem('token');
            }
            
            // Store user data if available
            if (res.user) {
              localStorage.setItem('user', JSON.stringify(res.user));
            }
            
            // Handle remember me functionality
            if (this.signinForm.get('rememberMe')?.value) {
              localStorage.setItem('rememberMe', 'true');
              localStorage.setItem('rememberedEmail', email);
            } else {
              localStorage.removeItem('rememberMe');
              localStorage.removeItem('rememberedEmail');
            }
            
            this.handleSuccessMessage();
          },
          error: (err: HttpErrorResponse) => {
            console.error('Signin error:', err);
            this.handleErrorMessage(err);
          },
          complete: () => {
            this.handleResetForm();
            this.isLoading = false;
          }
        });
      } else {
        this.isLoading = false;
        this.errorMessage = 'Please fill in all required fields.';
      }
    } else {
      this.isLoading = false;
      this.signinForm.markAllAsTouched();
    }
  }
  handlebeforeSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.signinForm.markAllAsTouched();
  }

  handleErrorMessage(err: HttpErrorResponse) {
    this.isLoading = false;
    
    if (err.status === 401) {
      this.errorMessage = 'Invalid email or password. Please check your credentials and try again.';
    } else if (err.status === 403) {
      this.errorMessage = 'Account is disabled. Please contact support.';
    } else if (err.status === 404) {
      this.errorMessage = 'User not found. Please check your email address.';
    } else if (err.status === 429) {
      this.errorMessage = 'Too many login attempts. Please try again later.';
    } else if (err.status === 500) {
      this.errorMessage = 'Server error. Please try again later.';
    } else {
      this.errorMessage = 'An error occurred while signing in. Please try again.';
    }
  }

  handleSuccessMessage() {
    this.successMessage = 'Successfully signed in! Redirecting...';
    
    timer(2000).subscribe(() => {
      this.router.navigate(['/app/home']);
    });
  }

  handleResetForm() {
    // Only reset if not successful
    if (!this.successMessage) {
      this.signinForm.reset();
      // Re-initialize remember me after reset
      this.initializeRememberMe();
    }
  }

  // Initialize remember me functionality
  private initializeRememberMe() {
    const rememberMe = localStorage.getItem('rememberMe');
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    
    if (rememberMe === 'true' && rememberedEmail) {
      this.signinForm.patchValue({
        email: rememberedEmail,
        rememberMe: true
      });
    }
  }

  // Handle remember me checkbox change
  onRememberMeChange() {
    const rememberMe = this.signinForm.get('rememberMe')?.value;
    const email = this.signinForm.get('email')?.value;
    
    if (!rememberMe) {
      // If unchecked, clear stored data
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('rememberedEmail');
    } else if (email) {
      // If checked and email exists, store it
      localStorage.setItem('rememberMe', 'true');
      localStorage.setItem('rememberedEmail', email);
    }
  }

  // Handle email field changes to update remembered email
  onEmailChange() {
    const rememberMe = this.signinForm.get('rememberMe')?.value;
    const email = this.signinForm.get('email')?.value;
    
    if (rememberMe && email) {
      localStorage.setItem('rememberedEmail', email);
    }
  }
}
