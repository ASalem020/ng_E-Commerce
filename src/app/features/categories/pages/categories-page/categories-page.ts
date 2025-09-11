import { Component, inject, OnInit } from '@angular/core';
import { CategoriesServices } from '../../services/categories.services';
import { ICategoriesData } from '../../interfaces/IGetAllCategories';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { IGetCategory } from '../../interfaces/IGetCategory';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-categories-page',
  imports: [LoadingSpinner, DatePipe],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.css'
})
export class CategoriesPage implements OnInit {
  //injected services
  categoriesServices = inject(CategoriesServices);
  //variables
  categories!: ICategoriesData[];
  categoryDetails!: ICategoriesData | null;
  ngOnInit(): void {
    this.GetAllCategories();
  }
  GetAllCategories() {
    this.categoriesServices.getCategories().subscribe(
      (res) => {
      // console.log(res);
      this.categories = res.data;
    });
  }
  getCategoryDetails(id: string) {
    this.categoriesServices.getCategoryDetails(id).subscribe((res) => {
      // console.log(res);
      this.categoryDetails = res.data;
    });
    }
  closeCategoryDetails() {
    this.categoryDetails = null;
  }
}
