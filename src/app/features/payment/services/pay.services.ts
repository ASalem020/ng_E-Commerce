import { Injectable } from "@angular/core";
import { BaseHttpService } from "../../../core/services/baseHttp";
import { appApis } from "../../../core/constants/appApis";
import { environment } from "../../../../environments/environments";

@Injectable({
    providedIn: 'root'
})
export class PaymentServices extends BaseHttpService {
    onlinePayment(data: {},cartId: string) {
        return this.post(appApis.onlinePayment + cartId, data,
            {
                'token': localStorage.getItem('token')
            }
        );
    }
    codPayment(data: {},cartId: string) {
        return this.post(appApis.codPayment + cartId, data,
            {
                'token': localStorage.getItem('token')
            }
        );
    }
}