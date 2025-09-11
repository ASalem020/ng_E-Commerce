import { Injectable } from '@angular/core';
import { BaseHttpService } from "../../../core/services/baseHttp";
import { appApis } from '../../../core/constants/appApis';
import { ICategoriesData, IGetAllCategories } from '../interfaces/IGetAllCategories';
import { ICategoryData, IGetCategory } from '../interfaces/IGetCategory';

@Injectable({
  providedIn: 'root'
})
export class CategoriesServices extends BaseHttpService {
    
    getCategories() {
        return this.get<IGetAllCategories>(appApis.categories);
    }
    getCategoryDetails(id: string) {
        return this.get<IGetCategory>(appApis.getCategoryDetails + id);
    }
}
