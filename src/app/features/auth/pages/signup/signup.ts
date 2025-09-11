import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SignupForm } from '../signup-form/signup-form';
@Component({
  selector: 'app-signup',
  imports: [SignupForm,RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  
}
