import { Injectable } from '@angular/core';
import { BaseHttpService } from "../../../core/services/baseHttp";
import { appApis } from '../../../core/constants/appApis';
import { IGetBrand } from '../interfaces/IGetBrand';
import { IGetAllBrands } from '../interfaces/IGetAllBrands';

@Injectable({
  providedIn: 'root'
})
export class BrandsServices extends BaseHttpService {
    
    // get all brands
    getBrands() {
        return this.get<IGetAllBrands>(appApis.brands);
        
    }
    // get brand details
    getBrandDetails(id: string) {
            return this.get<IGetBrand>(appApis.getBrandDetails + id);
    }
}
