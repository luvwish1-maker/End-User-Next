export interface ProductImage {
    id: string;
    productId: string;
    url: string;
    altText: string;
    isMain: boolean;
    sortOrder: number;
}

export interface Product {
    id: string;
    name: string;
    categoryName: string;
    discountedPrice: number;
    actualPrice: number;
    description: string;
    stockCount: number;
    isStock: boolean;
    createdAt: string;
    updatedAt: string;
    images: ProductImage[];
    is_wishlisted: boolean;
}

export interface CartItem {
    productId: string;
    quantity: number;
    cartId?: string;
}


export interface CartItems {
    productId: string;
    quantity: number;
    cartId?: string;
    product: Product;
    id: string;
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
