export interface Metadata {
	currentPage: number;
	numberOfPages: number;
	limit: number;
	nextPage: number;
}

export interface ShippingAddres {
	details: string;
	city: string;
	phone: string;
}

export interface User {
	_id: string;
	name: string;
	email: string;
	phone: string;
}

export interface Subcategory {
	_id: string;
	name: string;
	slug: string;
	category: string;
}

export interface Category {
	_id: string;
	name: string;
	slug: string;
	image: string;
}

export interface Brand {
	_id: string;
	name: string;
	slug: string;
	image: string;
}

export interface Product {
	subcategory: Subcategory[];
	ratingsQuantity: number;
	_id: string;
	title: string;
	imageCover: string;
	category: Category;
	brand: Brand;
	ratingsAverage: number;
	id: string;
}

export interface CartItem {
	count: number;
	_id: string;
	product: Product;
	price: number;
}

export interface AllOrdersData {
	shippingAddress: ShippingAddres;
	taxPrice: number;
	shippingPrice: number;
	totalOrderPrice: number;
	paymentMethodType: string;
	isPaid: boolean;
	isDelivered: boolean;
	_id: string;
	user: User;
	cartItems: CartItem[];
	paidAt: string;
	createdAt: string;
	updatedAt: string;
	id: number;
}

export interface IGetAllOrders {
	results: number;
	metadata: Metadata;
	data: AllOrdersData[];
}