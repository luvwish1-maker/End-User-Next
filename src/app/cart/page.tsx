"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CartItems } from "../types/types";
import styles from "./styles/page.module.css";
import ProductsService from "../services/productService";
import { BsX } from "react-icons/bs";

export default function Cart() {
    const [cartItems, setCartItems] = useState<CartItems[]>([]);
    const [loading, setLoading] = useState(true);

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

    const handleQuantityChange = async (item: CartItems, change: number) => {
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
                <div className={styles.left}>
                    {cartItems.map((item) => (
                        <div key={item.id} className={styles.cartItem}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={item.product.images.find(img => img.isMain)?.url || ''}
                                    alt={item.product.name}
                                    width={128}
                                    height={144}
                                    className={styles.productImage}
                                />
                            </div>

                            <div className={styles.details}>
                                <h4>{item.product.name}</h4>
                                <p>{item.product.description}</p>
                                <div className={styles.priceRow}>
                                    <span className={styles.discountedPrice}>₹{item.product.discountedPrice}</span>
                                    <span className={styles.actualPrice}>₹{item.product.actualPrice}</span>
                                </div>
                                <span className={styles.savings}>
                                    You save ₹{item.product.actualPrice - item.product.discountedPrice}
                                </span>

                                <BsX className={styles.closeIcon} onClick={() => handleRemoveItem(item.id)} />

                                <div className={styles.quantityControl}>
                                    <button onClick={() => handleQuantityChange(item, -1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => handleQuantityChange(item, 1)}>+</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

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
