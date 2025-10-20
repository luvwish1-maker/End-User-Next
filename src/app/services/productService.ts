// services/productsService.ts
import api from '../lib/axios';
import { CartItem, GetProductsParams, OrderItem, Product, WishlistItem } from '../types/types';

const ProductsService = {
    // Products
    getProducts: (params?: GetProductsParams) => api.get<Product[]>('/products', { params }),
    getProductByID: (id: string) => api.get<Product>(`/products/${id}`),

    // Cart
    addToCart: (item: CartItem) => api.post('/cart/add', item),
    getCart: () => api.get<CartItem[]>('/cart'),
    removeCartItem: (id: string) => api.delete(`/cart/delete-cart/${id}`),
    updateCartItem: (item: CartItem) => api.patch('/cart/update-cart', item),

    // Wishlist
    addToWishList: (item: WishlistItem) => api.post('/wishlist', item),
    getWishList: () => api.get<WishlistItem[]>('/wishlist'),
    removeFromWishList: (id: string) => api.delete(`/wishlist/?id=${id}`),

    // Orders
    createOrder: (item: OrderItem) => api.post('/payments/create-order', item),
};

export default ProductsService;
