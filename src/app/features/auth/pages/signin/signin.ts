import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SigninForm } from '../signin-form/signin-form';
@Component({
  selector: 'app-signin',
  imports: [SigninForm,RouterLink],
  templateUrl: './signin.html',
  styleUrl: './signin.css'
})
export class Signin {
  

}
