import { BaseHttpService } from "../../../core/services/baseHttp";
import { Injectable, inject } from "@angular/core";
import { appApis } from "../../../core/constants/appApis";
import { IGetAllOrders } from "../interfaces/IGetAllOrders";
import { IGetUserCart } from "../interfaces/IGetUserCart";
import { IUpdateProduct } from "../interfaces/IUpdateProduct";
import { StateService } from "../../../core/services/state.service";
import { tap } from 'rxjs/operators';
import { STORED_KEYS } from "../../../core/constants/storedKeys";

@Injectable({
    providedIn: 'root'
})
export class CartServices extends BaseHttpService {
    private stateService = inject(StateService);
    
    addProduct(productId: string) {
        return this.post(appApis.addToCart, {
            productId: productId
        }, {
            'token': STORED_KEYS.TOKEN
        }).pipe(
            tap(() => {
                // Refresh cart count after adding product
                this.refreshCartCount();
            })
        );
    } 
    
    getCart() {
        return this.get<IGetUserCart>(appApis.getCart, {}, {
            'token': STORED_KEYS.TOKEN
        });
    }

    // Method to refresh cart count and update state
    refreshCartCount() {
        this.getCart().subscribe({
            next: (res) => {
                const count = res.data.products?.reduce((total, item) => total + item.count, 0) || 0;
                this.stateService.updateCartCount(count);
            },
            error: () => {
                this.stateService.updateCartCount(0);
            }
        });
    }
    
    updateQuantity(productId: string, newQuantity: number) {
        return this.put<IUpdateProduct>(appApis.updateQuantity + productId, {
            count: newQuantity
        }, {
            'token': STORED_KEYS.TOKEN
        }).pipe(
            tap(() => {
                // Refresh cart count after updating quantity
                this.refreshCartCount();
            })
        );
    }

    deleteProduct(productId: string) {
        return this.delete(appApis.deleteProduct + productId, {}, {
            'token': STORED_KEYS.TOKEN
        }).pipe(
            tap(() => {
                // Refresh cart count after deleting product
                this.refreshCartCount();
            })
        );
    }

    clearCart() {
        return this.delete(appApis.clearCart, {}, {
            'token': STORED_KEYS.TOKEN
        }).pipe(
            tap(() => {
                // Refresh cart count after clearing cart
                this.refreshCartCount();
            })
        );
    }

    
    
    
    
    
    // getCheckout(id: string) {
    //     return this.get<IGetCheckout>(appApis.checkout + id);
    // }
    
    
    
    
    getOrders(userId: string) {
        return this.get<IGetAllOrders>(appApis.allorders + userId);
    }   
}