import { Component } from '@angular/core';
import { CategoriesSlider } from '../../components/categories-slider/categories-slider';

import { PopularProducts } from '../../components/popular-products/popular-products';
import { MainSlider } from '../../components/main-slider/main-slider';

@Component({
  selector: 'app-user-home-page',
  imports: [CategoriesSlider, MainSlider, PopularProducts],
  templateUrl: './user-home-page.html',
  styleUrl: './user-home-page.css'
})
export class UserHomePage {

}
