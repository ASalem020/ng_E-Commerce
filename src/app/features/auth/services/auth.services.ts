import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environments';
import { BaseHttpService } from '../../../core/services/baseHttp';
import { appApis } from '../../../core/constants/appApis';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthServices  extends BaseHttpService{

  private router = inject(Router);
  registerUser(userData: {}) {
    return this.post(
      appApis.registerApi, userData);
  }
  signin(userData: {email: string, password: string}) {
    return this.post(appApis.signinApi, userData);
  }
  signOut() {
  localStorage.clear();
    this.router.navigate(['/signin']);
  }
  verifyToken() {
    this.get(appApis.verifytoken).subscribe({next:(
      res: any) => {
      // console.log(res);
    },
    error: (err: any) => {
        this.signOut();
    }
  });
  }
}

