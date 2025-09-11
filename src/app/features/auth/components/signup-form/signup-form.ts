// import { Component, inject, signal, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthServices } from '../../services/auth.services';
// import { ToastrService } from 'ngx-toastr';

// @Component({
//   selector: 'app-signup-form',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './signup-form.html',
//   styleUrls: ['./signup-form.css']
// })
// export class SignupForm implements OnInit {
//   private authService = inject(AuthServices);
//   private router = inject(Router);
//   private toastr = inject(ToastrService);

//   // Form data
//   firstName = signal('');
//   lastName = signal('');
//   email = signal('');
//   password = signal('');
//   confirmPassword = signal('');
//   phone = signal('');
//   isLoading = signal(false);
//   showPassword = signal(false);
//   showConfirmPassword = signal(false);
//   acceptTerms = signal(false);

//   // Error states
//   firstNameError = signal('');
//   lastNameError = signal('');
//   emailError = signal('');
//   passwordError = signal('');
//   confirmPasswordError = signal('');
//   phoneError = signal('');
//   termsError = signal('');
//   generalError = signal('');

//   ngOnInit() {
//     // Initialize any default values if needed
//   }

//   togglePasswordVisibility() {
//     this.showPassword.update(show => !show);
//   }

//   toggleConfirmPasswordVisibility() {
//     this.showConfirmPassword.update(show => !show);
//   }

//   onAcceptTermsChange() {
//     this.acceptTerms.update(accept => !accept);
//     this.termsError.set('');
//   }

//   validateEmail(email: string): boolean {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   }

//   validatePhone(phone: string): boolean {
//     const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
//     return phoneRegex.test(phone.replace(/\s/g, ''));
//   }

//   validatePassword(password: string): { isValid: boolean; message: string } {
//     if (password.length < 8) {
//       return { isValid: false, message: 'Password must be at least 8 characters' };
//     }
//     if (!/(?=.*[a-z])/.test(password)) {
//       return { isValid: false, message: 'Password must contain at least one lowercase letter' };
//     }
//     if (!/(?=.*[A-Z])/.test(password)) {
//       return { isValid: false, message: 'Password must contain at least one uppercase letter' };
//     }
//     if (!/(?=.*\d)/.test(password)) {
//       return { isValid: false, message: 'Password must contain at least one number' };
//     }
//     if (!/(?=.*[@$!%*?&])/.test(password)) {
//       return { isValid: false, message: 'Password must contain at least one special character (@$!%*?&)' };
//     }
//     return { isValid: true, message: '' };
//   }

//   validateForm(): boolean {
//     let isValid = true;
    
//     // Reset errors
//     this.firstNameError.set('');
//     this.lastNameError.set('');
//     this.emailError.set('');
//     this.passwordError.set('');
//     this.confirmPasswordError.set('');
//     this.phoneError.set('');
//     this.termsError.set('');
//     this.generalError.set('');

//     // Validate first name
//     if (!this.firstName().trim()) {
//       this.firstNameError.set('First name is required');
//       isValid = false;
//     } else if (this.firstName().trim().length < 2) {
//       this.firstNameError.set('First name must be at least 2 characters');
//       isValid = false;
//     }

//     // Validate last name
//     if (!this.lastName().trim()) {
//       this.lastNameError.set('Last name is required');
//       isValid = false;
//     } else if (this.lastName().trim().length < 2) {
//       this.lastNameError.set('Last name must be at least 2 characters');
//       isValid = false;
//     }

//     // Validate email
//     if (!this.email().trim()) {
//       this.emailError.set('Email is required');
//       isValid = false;
//     } else if (!this.validateEmail(this.email().trim())) {
//       this.emailError.set('Please enter a valid email address');
//       isValid = false;
//     }

//     // Validate phone
//     if (this.phone().trim() && !this.validatePhone(this.phone().trim())) {
//       this.phoneError.set('Please enter a valid phone number');
//       isValid = false;
//     }

//     // Validate password
//     if (!this.password().trim()) {
//       this.passwordError.set('Password is required');
//       isValid = false;
//     } else {
//       const passwordValidation = this.validatePassword(this.password());
//       if (!passwordValidation.isValid) {
//         this.passwordError.set(passwordValidation.message);
//         isValid = false;
//       }
//     }

//     // Validate confirm password
//     if (!this.confirmPassword().trim()) {
//       this.confirmPasswordError.set('Please confirm your password');
//       isValid = false;
//     } else if (this.password() !== this.confirmPassword()) {
//       this.confirmPasswordError.set('Passwords do not match');
//       isValid = false;
//     }

//     // Validate terms acceptance
//     if (!this.acceptTerms()) {
//       this.termsError.set('You must accept the terms and conditions');
//       isValid = false;
//     }

//     return isValid;
//   }

//   onSubmit() {
//     if (!this.validateForm()) {
//       return;
//     }

//     this.isLoading.set(true);
//     this.generalError.set('');

//     const userData = {
//       name: `${this.firstName().trim()} ${this.lastName().trim()}`,
//       email: this.email().trim(),
//       password: this.password(),
//       phone: this.phone().trim() || undefined
//     };

//     this.authService.registerUser(userData).subscribe({
//       next: (response: any) => {
//         this.isLoading.set(false);
        
//         // Store user data if registration includes auto-login
//         if (response.token) {
//           localStorage.setItem('token', response.token);
//           localStorage.setItem('user', JSON.stringify(response.user));
//         }

//         this.toastr.success('Account created successfully!', 'Registration Successful');
//         this.router.navigate(['/signin']);
//       },
//       error: (error: any) => {
//         this.isLoading.set(false);
//         console.error('Signup error:', error);
        
//         if (error.error?.message) {
//           this.generalError.set(error.error.message);
//         } else if (error.error?.errors) {
//           // Handle validation errors from server
//           const errors = error.error.errors;
//           if (errors.email) {
//             this.emailError.set(errors.email[0]);
//           }
//           if (errors.password) {
//             this.passwordError.set(errors.password[0]);
//           }
//           if (errors.phone) {
//             this.phoneError.set(errors.phone[0]);
//           }
//         } else if (error.status === 409) {
//           this.generalError.set('An account with this email already exists');
//         } else if (error.status === 0) {
//           this.generalError.set('Network error. Please check your connection.');
//         } else {
//           this.generalError.set('An error occurred. Please try again.');
//         }
        
//         this.toastr.error(this.generalError(), 'Registration Failed');
//       }
//     });
//   }

//   getPasswordStrength(): { strength: string; percentage: number } {
//     const password = this.password();
//     if (!password) return { strength: '', percentage: 0 };

//     const validation = this.validatePassword(password);
//     if (validation.isValid) return { strength: 'Strong', percentage: 100 };
    
//     let score = 0;
//     if (password.length >= 8) score += 20;
//     if (/(?=.*[a-z])/.test(password)) score += 20;
//     if (/(?=.*[A-Z])/.test(password)) score += 20;
//     if (/(?=.*\d)/.test(password)) score += 20;
//     if (/(?=.*[@$!%*?&])/.test(password)) score += 20;

//     if (score < 40) return { strength: 'Weak', percentage: score };
//     if (score < 80) return { strength: 'Medium', percentage: score };
//     return { strength: 'Strong', percentage: score };
//   }
// }
