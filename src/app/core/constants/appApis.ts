import { environment } from '../../../environments/environments';
export const appApis = {
    // Auth APIs
    registerApi: `${environment.apiUrl}auth/signup`,
    signinApi: `${environment.apiUrl}auth/signin`,
    allorders: `${environment.apiUrl}orders/user`,
    verifytoken: `${environment.apiUrl}auth/verifyToken`,
    // Products APIs
    products: `${environment.apiUrl}products`,
    getProductDetails: `${environment.apiUrl}products/`,

    //Categories
    categories: `${environment.apiUrl}categories`,
    getCategoryDetails: `${environment.apiUrl}categories/`,
    
    // Cart APIs
    addToCart: `${environment.apiUrl}cart`,
    getCart: `${environment.apiUrl}cart`,
    deleteProduct: `${environment.apiUrl}cart/`,
    clearCart: `${environment.apiUrl}cart`,
    updateQuantity: `${environment.apiUrl}cart/`,
    // Payment APIs
    onlinePayment: `${environment.apiUrl}orders/checkout-session/:id?url=${environment.appUrl}`,
    codPayment: `${environment.apiUrl}orders/`,

    // Brands APIs
    brands: `${environment.apiUrl}brands`,
    getBrandDetails: `${environment.apiUrl}brands/`,

    // wishlist api
    wishlist: `${environment.apiUrl}wishlist`,
    getWishlist: `${environment.apiUrl}wishlist`,
    deleteWishlist: `${environment.apiUrl}wishlist/`,
    addToWishlist: `${environment.apiUrl}wishlist`,
    removeFromWishlist: `${environment.apiUrl}wishlist/`,

    // forget password api
    forgetPassword: `${environment.apiUrl}auth/forgotPasswords`,
}