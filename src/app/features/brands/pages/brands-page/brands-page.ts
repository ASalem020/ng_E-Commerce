import { Component, inject, OnInit } from '@angular/core';
import { IBrandData } from '../../interfaces/IGetAllBrands';
import { BrandsServices } from '../../services/brands.services';
import { DatePipe } from '@angular/common';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-brands-page',
  imports: [DatePipe, LoadingSpinner],
  templateUrl: './brands-page.html',
  styleUrl: './brands-page.css'
})
export class BrandsPage implements OnInit {
  //injected services
  brandsServices = inject(BrandsServices);

  //variables
  brands!: IBrandData[];
  brandDetails!: IBrandData | null;

  ngOnInit(): void {
    this.getBrands();
  }
  getBrands() {
    this.brandsServices.getBrands().subscribe((res) => {
      // console.log(res);
      this.brands = res.data;
    });
  }
  getBrandDetails(id: string) {
    this.brandsServices.getBrandDetails(id).subscribe((res) => {
      // console.log(res);
      this.brandDetails = res.data;
    });
  }
  closeBrandDetails() {
    this.brandDetails = null;
  }
}
