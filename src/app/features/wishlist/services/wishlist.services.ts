import { Injectable, inject } from '@angular/core';
import { BaseHttpService } from '../../../core/services/baseHttp';
import { appApis } from '../../../core/constants/appApis';
import { IGetUserWishlist, IWishlistData } from '../interfaces/IGetUserWishlist';
import { Observable, map, tap } from 'rxjs';
import { StateService } from '../../../core/services/state.service';

@Injectable({
    providedIn: 'root'
})

export class WishlistServices extends BaseHttpService {
    private stateService = inject(StateService);
    
    // get wishlist
    getWishlist(): Observable<IGetUserWishlist> {
        return this.get(appApis.getWishlist,{},
            {
                'token': localStorage.getItem('token')
            }
        );
    }

    // add to wishlist
    addToWishlist(productId: string) {
        return this.post(appApis.addToWishlist, { productId },
            {
                'token': localStorage.getItem('token')
            }
        ).pipe(
            tap(() => {
                // Refresh wishlist count after adding product
                this.refreshWishlistCount();
            })
        );
    }   

    // remove from wishlist
    removeFromWishlist(productId: string) {
        return this.delete(appApis.removeFromWishlist + productId,
            {},
            {
                'token': localStorage.getItem('token')
            }
        ).pipe(
            tap(() => {
                // Refresh wishlist count after removing product
                this.refreshWishlistCount();
            })
        );
    }

    // check if product is in wishlist
    isInWishlist(productId: string): Observable<boolean> {
        return this.getWishlist().pipe(
            map((response: IGetUserWishlist) => {
                return response.data.some((item: IWishlistData) => item._id === productId);
            })
        );
    }

    // get wishlist count
    getWishlistCount(): Observable<number> {
        return this.getWishlist().pipe(
            map((response: IGetUserWishlist) => response.count)
        );
    }

    // Method to refresh wishlist count and update state
    refreshWishlistCount() {
        this.getWishlistCount().subscribe({
            next: (count) => {
                this.stateService.updateWishlistCount(count);
            },
            error: () => {
                this.stateService.updateWishlistCount(0);
            }
        });
    }
}
