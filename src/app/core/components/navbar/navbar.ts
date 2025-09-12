import { Component, inject, Input, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, NavigationEnd } from "@angular/router";
import { AuthServices } from "../../../features/auth/services/auth.services";
import { CartServices } from '../../../features/cart/services/cart.services';
import { WishlistServices } from '../../../features/wishlist/services/wishlist.services';
import { StateService } from '../../../core/services/state.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { STORED_KEYS } from '../../constants/storedKeys';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit, OnDestroy {
  @Input() 
  set isLoggedIn(value: boolean) {
    this._isLoggedIn = value;
    if (value) {
      // Refresh counters when user logs in
      this.loadCartCount();
      this.loadWishlistCount();
    } else {
      // Reset counters when user logs out
      this.stateService.resetAll();
    }
  }
  
  
  
   userData=STORED_KEYS.USER

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }
  
  private _isLoggedIn: boolean = false;
  
  private authService = inject(AuthServices);
  private router = inject(Router);
  private cartService = inject(CartServices);
  private wishlistService = inject(WishlistServices);
  private stateService = inject(StateService);
  private destroy$ = new Subject<void>();

  // State management
  isMobileMenuOpen = signal(false);
  isUserMenuOpen = signal(false);
  isSearchFocused = signal(false);
  isSearchModalOpen = signal(false);
  searchQuery = signal('');
  cartItemCount = signal(0);
  wishlistItemCount = signal(0);
  isDarkMode = signal(false);
  currentRoute = signal('');
  

  ngOnInit() {
    this.subscribeToStateChanges();
    // this.checkDarkMode();
    this.setupEventListeners();
    this.trackCurrentRoute();
    
    // Load initial counts if user is already logged in
    if (this.isLoggedIn) {
      this.loadCartCount();
      this.loadWishlistCount();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCartCount() {
    if (this.isLoggedIn) {
      this.cartService.refreshCartCount();
    }
  }

  private loadWishlistCount() {
    if (this.isLoggedIn) {
      this.wishlistService.refreshWishlistCount();
    }
  }

  private subscribeToStateChanges() {
    // Subscribe to cart count changes
    this.stateService.cartCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.cartItemCount.set(count);
      });

    // Subscribe to wishlist count changes
    this.stateService.wishlistCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.wishlistItemCount.set(count);
      });
  }

  // private checkDarkMode() {
  //   const isDark = localStorage.getItem('theme') === 'dark' || 
  //                  (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  //   this.isDarkMode.set(isDark);
  //   this.updateTheme(isDark);
  // }

  private setupEventListeners() {
    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.mobile-menu') && !target.closest('.mobile-menu-button')) {
        this.isMobileMenuOpen.set(false);
      }
      if (!target.closest('.user-menu') && !target.closest('.user-menu-button')) {
        this.isUserMenuOpen.set(false);
      }
    });
  }

  private trackCurrentRoute() {
    // Set initial route
    this.currentRoute.set(this.router.url);
    
    // Track route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute.set(event.url);
        
        // Refresh counters when navigating to the app (in case user has items from previous session)
        if (this.isLoggedIn && (event.url === '/' || event.url === '/home')) {
          this.loadCartCount();
          this.loadWishlistCount();
        }
      });
  }

  isActiveRoute(route: string): boolean {
    const currentUrl = this.currentRoute();
    
    // Handle root route
    if (route === '/' && currentUrl === '/') {
      return true;
    }
    
    // Handle other routes
    if (route !== '/' && currentUrl.startsWith(route)) {
      return true;
    }
    
    return false;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(open => !open);
  }

  toggleUserMenu() {
    this.isUserMenuOpen.update(open => !open);
  }

  toggleSearchModal() {
    this.isSearchModalOpen.update(open => !open);
    if (!this.isSearchModalOpen()) {
      this.searchQuery.set('');
    }
  }

  closeSearchModal() {
    this.isSearchModalOpen.set(false);
    this.searchQuery.set('');
  }

  toggleDarkMode() {
    this.isDarkMode.update(mode => {
      const newMode = !mode;
      this.updateTheme(newMode);
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  }

  private updateTheme(isDark: boolean) {
    if (isDark) {

      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }

  onSearchFocus() {
    this.isSearchFocused.set(true);
  }

  onSearchBlur() {
    setTimeout(() => this.isSearchFocused.set(false), 200);
  }

  onSearchSubmit(event: Event) {
    event.preventDefault();
    if (this.searchQuery().trim()) {
      this.router.navigate(['/app/products'], { queryParams: { search: this.searchQuery().trim() } });
      this.closeSearchModal();
    }
  }

  logout() {
    this.authService.signOut();
    this.isUserMenuOpen.set(false);
  }

  navigateToCart() {
    this.router.navigate(['/app/cart']);
  }

  navigateToWishlist() {
    this.router.navigate(['/app/wishlist']);
  }
}