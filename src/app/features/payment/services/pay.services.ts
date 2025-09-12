import { Injectable } from "@angular/core";
import { BaseHttpService } from "../../../core/services/baseHttp";
import { appApis } from "../../../core/constants/appApis";
import { environment } from "../../../../environments/environments";
import { STORED_KEYS } from "../../../core/constants/storedKeys";
    
@Injectable({
    providedIn: 'root'
})
export class PaymentServices extends BaseHttpService {
    onlinePayment(data: {},cartId: string) {
        return this.post(appApis.onlinePayment + cartId+`?url=${environment.appUrl}`, data,
            {
                'token': STORED_KEYS.TOKEN
            }
        );
    }
    codPayment(data: {},cartId: string) {
        return this.post(appApis.codPayment + cartId, data,
            {
                'token': STORED_KEYS.TOKEN
            }
        );
    }
}