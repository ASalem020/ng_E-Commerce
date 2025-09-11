import { Component, inject, OnInit } from '@angular/core';
import { productsServices } from '../../services/products.services';
import { IGetAllProducts, IProductsData } from '../../interfaces/IGetAllProducts';
import { Card } from '../../components/card/card';
import { LoadingSpinner } from '../../../../shared/components/loading-spinner/loading-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-products-home',
  imports: [Card, LoadingSpinner, NgxPaginationModule, FormsModule, CommonModule],
  templateUrl: './products-home.html',
  styleUrl: './products-home.css'
})
export class ProductsHome implements OnInit {
  //inject services
  private readonly productsServices = inject(productsServices);  

  // Pagination
  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 12;
  isLoading: boolean = false;
  
  // Products data
  products: IProductsData[] | null = null;
  filteredProducts: IProductsData[] = [];
  
  // Search and filter
  searchQuery: string = '';
  sortBy: string = '';
  viewMode: 'grid' | 'list' = 'grid';
  
  // Search debounce
  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.getProducts();
    this.setupSearchDebounce();
  }

  setupSearchDebounce(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.filterProducts();
      });
  }

  getProducts() {
    this.isLoading = true;
    const params: any = { page: this.page, limit: this.itemsPerPage };
    
    // Add search parameter if search query exists
    if (this.searchQuery.trim()) {
      params.search = this.searchQuery.trim();
    }
    
    // Add sort parameter if sort is selected
    if (this.sortBy) {
      params.sort = this.sortBy;
    }

    this.productsServices.getProducts(params).subscribe((res) => {
      // console.log('API Response:', res);
      this.products = res.data;
      this.totalItems = res.results;
      this.itemsPerPage = res.metadata.limit;
      
      // Initialize filtered products
      this.filteredProducts = [...this.products];
      
      // console.log('Pagination Data:', 
      // {
      //   currentPage: this.page,
      //   totalItems: this.totalItems,
      //   itemsPerPage: this.itemsPerPage,
      //   totalPages: Math.ceil(this.totalItems / this.itemsPerPage)
      // });
      this.isLoading = false;
    });
  }
  pageChanged(pageNumber: number) {
    this.page = pageNumber;
    // console.log(this.page);
    this.getProducts();
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const currentPage = this.page;
    const maxVisible = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    const pages: number[] = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.getTotalPages()) {
      this.page = pageNumber;
      this.getProducts();
    }
  }

  goToPreviousPage() {
    if (this.page > 1) {
      this.page--;
      this.getProducts();
    }
  }

  goToNextPage() {
    if (this.page < this.getTotalPages()) {
      this.page++;
      this.getProducts();
    }
  }

  // Search functionality
  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.page = 1;
    this.getProducts();
  }

  // Sort functionality
  onSortChange(): void {
    this.page = 1;
    this.getProducts();
  }

  clearSort(): void {
    this.sortBy = '';
    this.page = 1;
    this.getProducts();
  }

  getSortLabel(sortBy: string): string {
    const sortLabels: { [key: string]: string } = {
      'price-asc': 'Price: Low to High',
      'price-desc': 'Price: High to Low',
      'rating-desc': 'Highest Rated',
      'name-asc': 'Name: A to Z',
      'name-desc': 'Name: Z to A'
    };
    return sortLabels[sortBy] || sortBy;
  }

  // View mode functionality
  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  // Client-side filtering (for when API doesn't support search)
  filterProducts(): void {
    if (!this.products) return;

    let filtered = [...this.products];

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.name.toLowerCase().includes(query) ||
        product.brand.name.toLowerCase().includes(query)
      );
    }

    // Apply sort filter
    if (this.sortBy) {
      filtered = this.sortProducts(filtered, this.sortBy);
    }

    this.filteredProducts = filtered;
  }

  private sortProducts(products: IProductsData[], sortBy: string): IProductsData[] {
    const sorted = [...products];
    
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating-desc':
        return sorted.sort((a, b) => b.ratingsAverage - a.ratingsAverage);
      case 'name-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'name-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  }
}
