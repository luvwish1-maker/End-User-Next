// services/productsService.ts
import api from '../lib/axios';
import { CartItem, CartItems, GetProductsParams, OrderItem, Product, WishlistItem } from '../types/types';

interface ProductsResponse {
    success: boolean;
    data: {
        data: Product[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    };
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}

export interface CartResponse {
  success: boolean;
  data: CartItems[];
}

const ProductsService = {
    // Products
    getProducts: (params?: GetProductsParams) => api.get<ProductsResponse>('/products', { params }),
    getProductByID: (id: string) => api.get<ProductResponse>(`/products/${id}`),

    // Cart
    addToCart: (item: CartItem) => api.post('/cart/add', item),
    getCart: () => api.get<CartResponse>('/cart'),
    removeCartItem: (id: string) => api.delete(`/cart/delete-cart/${id}`),
    updateCartItem: (item: CartItems) => api.patch('/cart/update-cart', item),

    // Wishlist
    addToWishList: (item: WishlistItem) => api.post('/wishlist', item),
    getWishList: () => api.get<WishlistItem[]>('/wishlist'),
    removeFromWishList: (id: string) => api.delete(`/wishlist/?id=${id}`),

    // Orders
    createOrder: (item: OrderItem) => api.post('/payments/create-order', item),
};

export default ProductsService;
