"use client";

import Image from "next/image";
import { BsPlusLg } from "react-icons/bs";
import styles from "./styles/sorted.module.css";
import type { Product } from "../types/types";
import ProductsService from "../services/productService";
import { useAlert } from "@/components/alert/alertProvider";
import { AxiosError } from "axios";
import { useAuth } from "../lib/authContext";
import LoginModal from "@/app/login/loginModal";
import { useState } from "react";

export default function Sorted({ products }: { products: Product[] }) {
    const { showAlert } = useAlert();
    const { isLoggedIn, login } = useAuth();
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleAddToCart = async (productId: string) => {
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

        setLoadingId(productId);
        try {
            await ProductsService.addToCart({ productId, quantity: 1 });
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
                if (typeof backendMessage === "string") {
                    message = backendMessage;
                }
            } else if (error instanceof Error) {
                message = error.message;
            }
            showAlert({
                message,
                type: "error",
                autoDismiss: true,
                duration: 3000,
            });
        } finally {
            setLoadingId(null);
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

    return (
        <div className={styles.container}>
            {products.map((product) => {
                const discounted = Number(product.discountedPrice);
                const actual = Number(product.actualPrice);
                const discountPercent = ((actual - discounted) / actual) * 100;
                const mainImage = product.images[0]?.url;

                return (
                    <div key={product.id} className={styles.productCard}>
                        <div className={styles.imageWrapper}>
                            <Image
                                src={mainImage || "/placeholder.png"}
                                alt={product.name}
                                width={270}
                                height={340}
                                className={styles.productImage}
                            />
                        </div>

                        <p className={styles.productCategory}>{product.categoryName}</p>
                        <h3 className={styles.productName}>{product.name}</h3>

                        <div className={styles.priceRow}>
                            <span className={styles.discountedPrice}>
                                ₹{discounted.toFixed(2)}
                            </span>
                            <span className={styles.actualPrice}>
                                ₹{actual.toFixed(2)}
                            </span>
                            <span className={styles.discountTag}>
                                -{Math.round(discountPercent)}%
                            </span>
                        </div>

                        <button
                            className={styles.cartButton}
                            onClick={() => handleAddToCart(product.id)}
                            disabled={loadingId === product.id}
                        >
                            {loadingId === product.id ? "Adding..." : <><BsPlusLg /> Add to Cart</>}
                        </button>
                    </div>
                );
            })}

            {showLoginModal && (
                <LoginModal
                    onClose={() => setShowLoginModal(false)}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}
        </div>
    );
}
