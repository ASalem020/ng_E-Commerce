import { Component, inject, OnInit } from '@angular/core';
import { productsServices } from '../../../products/services/products.services';
import { IProductsData } from '../../../products/interfaces/IGetAllProducts';
import { Card } from '../../../products/components/card/card';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-popular-products',
  imports: [Card, LoadingSpinner],
    templateUrl: './popular-products.html',
  styleUrl: './popular-products.css'
})
export class PopularProducts implements OnInit {
    //injected services
    productsServices = inject(productsServices);
    allProducts!: IProductsData[];
    
  ngOnInit(): void {
        this.getAllProducts();
    }
    getAllProducts() {
        this.productsServices.getProducts({ limit: 8}).subscribe((res) => {
            // console.log(res);
            this.allProducts = res.data;
            // console.log(this.allProducts);
        });
    }
    
    
    
}
