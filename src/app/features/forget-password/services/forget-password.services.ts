import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../../core/services/baseHttp';
import { appApis } from '../../../core/constants/appApis';

@Injectable({
  providedIn: 'root'
})
export class ForgetPasswordServices extends BaseHttpService {
  resetPassword(email: string) {
    return this.post(appApis.forgetPassword, { email: email });
  }
}
