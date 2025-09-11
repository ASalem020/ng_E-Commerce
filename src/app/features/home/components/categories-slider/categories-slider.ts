import { Component, inject, OnInit } from '@angular/core';
import { CategoriesServices } from '../../../categories/services/categories.services';
import { ICategoriesData } from '../../../categories/interfaces/IGetAllCategories';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-categories-slider',
  imports: [CarouselModule],
  templateUrl: './categories-slider.html',
  styleUrl: './categories-slider.css'
})
export class CategoriesSlider implements OnInit {



  //injected services
  categoriesServices = inject(CategoriesServices);
  
  //variables
  categories!: ICategoriesData[];

  ngOnInit(): void {
    this.getCategories();
  }
  getCategories() {
    this.categoriesServices.getCategories().subscribe((res) => {
      // console.log(res);
      this.categories = res.data;
    });
  }
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    
    autoplay: true,
    autoplayTimeout: 3000,
    autoplaySpeed: 1000,
    autoplayHoverPause: true,
    nav: true,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      },
      1200: {
        items: 5
      },
      1500: {
        items: 6
      }

    }
  }
}
