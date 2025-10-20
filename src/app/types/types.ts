// types.ts
export interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
}

export interface CartItem {
    productId: string;
    quantity: number;
    cartId?: string;
}

export interface WishlistItem {
    productId: string;
}

export interface OrderItem {
    productId: string;
    cartId?: string;
    quantity: number;
    currency: string;
}

export interface GetProductsParams {
    limit?: number;
    page?: number;
}
