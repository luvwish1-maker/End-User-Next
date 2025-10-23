"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CartItem } from "../types/types";
import styles from "./styles/page.module.css";
import ProductsService from "../services/productService";

export default function Cart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch cart items
    const fetchCart = async () => {
        try {
            const response = await ProductsService.getCart();            
            setCartItems(response.data.data);
        } catch (error) {
            console.error("Error fetching cart", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleQuantityChange = async (item: CartItem, change: number) => {
        const newQuantity = item.quantity + change;
        if (newQuantity < 1) return;

        try {
            await ProductsService.updateCartItem({ ...item, quantity: newQuantity });
            fetchCart();
        } catch (error) {
            console.error("Error updating cart item", error);
        }
    };

    const handleRemoveItem = async (id: string) => {
        try {
            await ProductsService.removeCartItem(id);
            fetchCart();
        } catch (error) {
            console.error("Error removing cart item", error);
        }
    };

    console.log(cartItems);

    const subtotal = cartItems.reduce((acc, item) => acc + item.product.discountedPrice * item.quantity, 0);
    const totalSavings = cartItems.reduce(
        (acc, item) => acc + (item.product.actualPrice - item.product.discountedPrice) * item.quantity,
        0
    );

    if (loading) return <p>Loading cart...</p>;

    return (
        <div className={styles.container}>
            <div className={styles.head}>
                <h3>Shopping Cart</h3>
                <p>{cartItems.length} items in your cart</p>
            </div>

            <div className={styles.content}>
                {/* Left Section - Cart Items */}
                <div className={styles.left}>
                    {cartItems.map((item) => (
                        <div key={item.id} className={styles.cartItem}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={item.product.images.find(img => img.isMain)?.url || ''} // ✅ main image
                                    alt={item.product.name}
                                    width={100}
                                    height={100}
                                    className={styles.productImage}
                                />
                            </div>
                            <div className={styles.details}>
                                <h4>{item.product.name}</h4>
                                <p>{item.product.description}</p>
                                <p className={styles.price}>
                                    ₹{item.product.discountedPrice}{" "}
                                    <span className={styles.originalPrice}>₹{item.product.actualPrice}</span>
                                </p>
                                <p className={styles.savings}>
                                    You save ₹{item.product.actualPrice - item.product.discountedPrice}
                                </p>
                                <div className={styles.quantityControl}>
                                    <button onClick={() => handleQuantityChange(item, -1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => handleQuantityChange(item, 1)}>+</button>
                                </div>
                                <button className={styles.removeBtn} onClick={() => handleRemoveItem(item.id)}>
                                    ×
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Section - Order Summary */}
                <div className={styles.right}>
                    <h4>Order Summary</h4>
                    <div className={styles.summaryItem}>
                        <span>Subtotal ({cartItems.length} items)</span>
                        <span>₹{subtotal}</span>
                    </div>
                    <div className={styles.summaryItem}>
                        <span>Product Savings</span>
                        <span>-₹{totalSavings}</span>
                    </div>
                    <div className={styles.summaryItem}>
                        <span>Delivery Fee</span>
                        <span>FREE</span>
                    </div>
                    <hr />
                    <div className={styles.total}>
                        <span>Total Amount</span>
                        <span>₹{subtotal}</span>
                    </div>
                    <button className={styles.addToCartBtn}>Add to cart</button>
                    <button className={styles.buyNowBtn}>Buy Now</button>
                    <p className={styles.subInfo}>Subscribe & Save 10%</p>
                    <p className={styles.subInfo}>Secure Checkout</p>
                    <p className={styles.subInfo}>Easy 30-day Returns</p>
                </div>
            </div>
        </div>
    );
}
