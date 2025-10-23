"use client"

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { BsStarFill, BsTruck, BsShield, BsArrowRepeat, BsLock } from "react-icons/bs";
import { Product } from "@/app/types/types";
import ProductsService from "../services/productService";
import styles from "./styles/page.module.css";

export default function Details() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (!id) return;
        const fetchProduct = async () => {
            try {
                const response = await ProductsService.getProductByID(id);
                setProduct(response.data.data);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <p className={styles.center}>Loading...</p>;
    if (!product) return <p className={styles.center}>Product not found.</p>;

    const mainImage = product.images?.find((img) => img.isMain)?.url || "";

    return (
        <div className={`container ${styles.detailsContainer}`}>
            <div className={styles.productLayout}>
                {/* Left: Image */}
                <div className={styles.imageSection}>
                    {mainImage && (
                        <Image
                            src={mainImage}
                            alt={product.name}
                            width={500}
                            height={500}
                            className={styles.productImage}
                        />
                    )}
                </div>

                {/* Right: Info */}
                <div className={styles.infoSection}>
                    <h2 className={styles.title}>{product.name}</h2>

                    {/* Stars / Reviews */}
                    <div className={styles.stars}>
                        {[...Array(5)].map((_, i) => (
                            <BsStarFill key={i} color="#FFD700" size={20} />
                        ))}
                        <p>4.9(3,847 reviews)</p>
                    </div>

                    {/* Description */}
                    <p className={styles.description}>{product.description}</p>

                    {/* Quantity Block */}
                    <div className={styles.quantityBlock}>
                        <label>Quantity:</label>
                        <div className={styles.quantityControl}>
                            <button
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                className={styles.qtyBtn}
                            >
                                -
                            </button>
                            <span>{quantity}</span>
                            <button
                                onClick={() => setQuantity((q) => q + 1)}
                                className={styles.qtyBtn}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Buttons: Add to Cart / Buy Now in separate columns */}
                    <div className={styles.buttonColumn}>
                        <button className={styles.addToCart}>Add to Cart</button>
                    </div>
                    <div className={styles.buttonColumn}>
                        <button className={styles.buyNow}>Buy Now</button>
                    </div>

                    {/* Subscribe & Save */}
                    <p className={styles.subscribe}>Subscribe & Save 10%</p>

                    {/* Icons with labels */}
                    <div className={styles.iconRow}>
                        <div className={styles.iconItem}>
                            <span><BsTruck /></span>
                            <span>Fast Delivery</span>
                        </div>
                        <div className={styles.iconItem}>
                            <span><BsShield /></span>
                            <span>Secure Payment</span>
                        </div>
                        <div className={styles.iconItem}>
                            <span><BsArrowRepeat /></span>
                            <span>Easy Returns</span>
                        </div>
                        <div className={styles.iconItem}>
                            <span><BsLock /></span>
                            <span>Top Rated</span>
                        </div>
                    </div>

                    {/* Available Offers */}
                    <div className={styles.offersSection}>
                        <h4>Available Offers</h4>
                        <ul>
                            <li>10% off on first purchase</li>
                            <li>Buy 2 get 1 free</li>
                            <li>Free shipping on orders over ₹999</li>
                        </ul>
                    </div>

                    {/* Stock */}
                    <p
                        className={`${styles.stockStatus} ${product.isStock ? styles.inStock : styles.outOfStock
                            }`}
                    >
                        {product.isStock
                            ? `In Stock (${product.stockCount} available)`
                            : "Out of Stock"}
                    </p>
                </div>
            </div>
        </div>
    );
}
