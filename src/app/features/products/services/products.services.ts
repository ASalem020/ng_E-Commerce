import { BaseHttpService } from "../../../core/services/baseHttp";
import { appApis } from "../../../core/constants/appApis";
import { Injectable } from "@angular/core";
import { IGetAllProducts } from "../interfaces/IGetAllProducts";
import { IGetSingleProduct } from "../interfaces/IGetSingleProduct";
import { Params } from "@angular/router";
import { HttpParams } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class productsServices extends BaseHttpService{
    getProducts(filter?:Params) {
        const params= new HttpParams().appendAll(filter || {});
        
            return this.get<IGetAllProducts>(appApis.products,filter);
    }
       getSingleProduct(id: string) {
        return this.get<IGetSingleProduct>(appApis.getProductDetails + id);
       }
    
   
 
}