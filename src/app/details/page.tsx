"use client"

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { BsStarFill, BsTruck, BsShield, BsArrowRepeat, BsLock, BsCheckCircle, BsRepeat } from "react-icons/bs";
import { Product } from "@/app/types/types";
import ProductsService from "../services/productService";
import styles from "./styles/page.module.css";
import { useAuth } from "../lib/authContext";
import { useAlert } from "@/components/alert/alertProvider";
import LoginModal from "@/app/login/loginModal";
import { AxiosError } from "axios";
import Products from "../shared/products";
import Counts from "../shared/counts";
import Test from "../shared/test";
import Solution from "../shared/solution";
import Subscribe from "../shared/subscribe";

export default function Details() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { isLoggedIn, login } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { showAlert } = useAlert();

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

    const handleAddToCart = async () => {
        if (!product) return;

        if (!isLoggedIn) {
            setShowLoginModal(true);
            showAlert({
                message: "Please log in to add item to cart",
                type: "info",
                autoDismiss: true,
                duration: 3000,
            });
            return;
        }

        try {
            await ProductsService.addToCart({ productId: product.id, quantity });
            showAlert({
                message: "Added to cart!",
                type: "success",
                autoDismiss: true,
                duration: 2500,
            });
        } catch (error: unknown) {
            let message = "An unexpected error occurred";

            if (error instanceof AxiosError) {
                const backendMessage = error.response?.data?.message;
                if (typeof backendMessage === "string") message = backendMessage;
            } else if (error instanceof Error) {
                message = error.message;
            }

            showAlert({
                message,
                type: "error",
                autoDismiss: true,
                duration: 3000,
            });
        }
    };

    const handleLoginSuccess = () => {
        login();
        setShowLoginModal(false);
        showAlert({
            message: "Successfully logged in!",
            type: "success",
            autoDismiss: true,
            duration: 3000,
        });
    };

    if (loading) return <div className={styles.spinner}></div>;
    if (!product) return <p className={styles.center}>Product not found.</p>;

    const mainImage = product.images?.find((img) => img.isMain)?.url || "";

    return (
        <>
            <div className={`container ${styles.detailsContainer}`}>
                <div className={styles.productLayout}>
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

                    <div className={styles.infoSection}>
                        <h2 className={styles.title}>{product.name}</h2>

                        <div className={styles.stars}>
                            {[...Array(5)].map((_, i) => (
                                <BsStarFill key={i} color="#A31157" size={20} />
                            ))}
                            <p>4.9(3,847 reviews)</p>
                        </div>

                        <p className={styles.description}>{product.description}</p>

                        <div className={styles.price}>
                            <p className={styles.discountprice}>₹{product.discountedPrice}</p>
                            <p className={styles.actualprice}>₹{product.actualPrice}</p>
                            {product.actualPrice > product.discountedPrice && (
                                <div className={styles.discountBadge}>
                                    {Math.round(
                                        ((product.actualPrice - product.discountedPrice) / product.actualPrice) * 100
                                    )}% OFF
                                </div>
                            )}
                        </div>

                        <p className={`${styles.stockStatus} ${product.isStock ? styles.inStock : styles.outOfStock}`}>
                            {product.isStock ? `In Stock (${product.stockCount} available)` : "Out of Stock"}
                        </p>

                        <div className={styles.quantityBlock}>
                            <label>Quantity:</label>
                            <div className={styles.quantityControl}>
                                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className={styles.qtyBtn}>-</button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity((q) => q + 1)} className={styles.qtyBtn}>+</button>
                            </div>
                        </div>

                        <div className={styles.buttonColumn}>
                            <button className={styles.addToCart} onClick={handleAddToCart}>
                                Add to Cart
                            </button>
                        </div>
                        <div className={styles.buttonColumn}>
                            <button className={styles.buyNow}>Buy Now</button>
                        </div>

                        <p className={styles.subscribe}><BsRepeat />  Subscribe & Save 10%</p>

                        <div className={styles.iconRow}>
                            <div className={styles.iconItem}><BsTruck color="#A31157" size={18} /><span>Free Delivery</span></div>
                            <div className={styles.iconItem}><BsShield color="#A31157" size={18} /><span>Secure Payment</span></div>
                            <div className={styles.iconItem}><BsArrowRepeat color="#A31157" size={18} /><span>Easy Returns</span></div>
                            <div className={styles.iconItem}><BsLock color="#A31157" size={18} /><span>Discreet Package</span></div>
                        </div>

                        <div className={styles.offersSection}>
                            <h4>Available Offers</h4>
                            <ul>
                                <li><BsCheckCircle color="#1F8A5B" /> Get 10% instant discount on orders above ₹999</li>
                                <li><BsCheckCircle color="#1F8A5B" /> Free shipping on all prepaid orders</li>
                                <li><BsCheckCircle color="#1F8A5B" /> Subscribe & save an extra 10% on every order</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onLoginSuccess={handleLoginSuccess} />}
            </div>

            <div className={styles.head}>
                <h3>Offer Sale 20% off</h3>
            </div>
            <Products />

            <div className={styles.countsWrapper}>
                <Counts />
            </div>

            <Test />
            <Solution />
            <Subscribe />

        </>
    );
}
