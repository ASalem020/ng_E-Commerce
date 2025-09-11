import { Component, inject, OnInit } from '@angular/core';
import { CartServices } from '../../services/cart.services';
import { AllOrdersData, IGetAllOrders } from '../../interfaces/IGetAllOrders';

@Component({
  selector: 'app-all-orders',
  imports: [],
  templateUrl: './all-orders.html',
  styleUrl: './all-orders.css'
})
export class AllOrders implements OnInit {

  allOrders:  AllOrdersData[] = [];
  cartService = inject(CartServices); 
  ngOnInit(): void {
    this.getUserId();
    this.getAllOrders();
  }
  getAllOrders() {
    this.cartService.getOrders(this.getUserId() as string).subscribe((res) => {
      // console.log(res);
      this.allOrders=res.data;
    });
  }
  getUserId() {
      return localStorage.getItem('userId');
    }
  
}
