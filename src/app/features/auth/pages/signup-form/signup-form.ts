import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServices } from '../../services/auth.services';
import { HttpErrorResponse } from '@angular/common/http';
import { interval, take } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup-form',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './signup-form.html',
  styleUrl: './signup-form.css'
})
export class SignupForm {
  // inject the auth service and router

  private readonly authService = inject(AuthServices);
  private router= inject(Router)
  // variables
  timer: number = 5;
  isLoading: boolean = false;
  errorMessage!: string | undefined;
  successMessage!: string | undefined;
  
  // signup form with enhanced validators
  signupForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[a-zA-Z\s]+$/)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    ]),
    rePassword: new FormControl('', [Validators.required]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?:\+20|0)1[0125][0-9]{8}$/
)
    ]),
  }, { validators: this.passwordMatchValidator });

  // password match validator
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const rePassword = control.get('rePassword');
    
    if (password && rePassword && password.value !== rePassword.value) {
      rePassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (rePassword?.hasError('passwordMismatch')) {
      rePassword.setErrors(null);
    }
    
    return null;
  }

  // password strength checker
  getPasswordStrength(): string {
    const password = this.signupForm.get('password')?.value || '';
    
    if (password.length < 6) return 'weak';
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength++;
    
    // Lowercase check
    if (/[a-z]/.test(password)) strength++;
    
    // Uppercase check
    if (/[A-Z]/.test(password)) strength++;
    
    // Number check
    if (/\d/.test(password)) strength++;
    
    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    if (strength < 3) return 'weak';
    if (strength < 5) return 'medium';
    return 'strong';
  }
  onSubmit() {
    this.handlebeforeSubmit();
    
    // Only submit if form is valid
    if (this.signupForm.valid) {
      const formData = {
        name: this.signupForm.get('name')?.value,
        email: this.signupForm.get('email')?.value,
        password: this.signupForm.get('password')?.value,
        rePassword: this.signupForm.get('rePassword')?.value,
        phone: this.signupForm.get('phone')?.value
      };
      
      this.authService.registerUser(formData)
      .subscribe({
        next: (res: any) => {
          this.handleSuccessMessage();
        },
        error: (err: HttpErrorResponse) => {
          this.handleErrorMessage();
        },
        complete: () => {
          this.handleResetForm();
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
      this.signupForm.markAllAsTouched();
    }
  } 
  handlebeforeSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.signupForm.markAllAsTouched();
  }
  handleSuccessMessage() {
    this.successMessage = ' Successfully registered  ';
    
    interval(1000).pipe(take(5)).subscribe(() => {
      this.timer--;
      if (this.timer === 0) {
        this.router.navigate(['/signin']);
      }
    });
  }
  handleErrorMessage() {
    this.errorMessage = ' Error registering user, please try again... ';
    this.isLoading = false; 
  }
  handleResetForm() {
    this.signupForm.reset();
  }


}
