"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BsPlusLg } from "react-icons/bs";
import { Product } from "../types/types";
import ProductsService from "../services/productService";
import { useAlert } from "@/components/alert/alertProvider";
import { AxiosError } from "axios";
import { useAuth } from "../lib/authContext";
import LoginModal from "@/app/login/loginModal";
import styles from "./styles/random.module.css";

export default function Random() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { showAlert } = useAlert();
    const { isLoggedIn, login } = useAuth();

    useEffect(() => {
        const fetchRandomProducts = async () => {
            try {
                const response = await ProductsService.getProducts({ page: 1, limit: 50 });
                const allProducts = response.data.data.data;
                // Get 6 random products
                const randomSix = allProducts.sort(() => 0.5 - Math.random()).slice(0, 8);
                setProducts(randomSix);
            } catch (error) {
                console.error("Failed to fetch random products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRandomProducts();
    }, []);

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

    if (loading)
        return (
            <div className={styles.loaderWrapper}>
                <div className={styles.loader}></div>
            </div>
        );

    return (
        <div className={styles.container}>
            {products.map((product) => {
                const mainImage = product.images.find((img) => img.isMain);
                const discountPercent =
                    ((Number(product.actualPrice) - Number(product.discountedPrice)) /
                        Number(product.actualPrice)) *
                    100;

                return (
                    <div key={product.id} className={styles.productCard}>
                        <div className={styles.imageWrapper}>
                            {mainImage && (
                                <Image
                                    src="/c1.png"
                                    alt={mainImage.altText || product.name}
                                    width={270}
                                    height={340}
                                    className={styles.productImage}
                                />
                            )}
                        </div>

                        <p className={styles.productCategory}>{product.categoryName}</p>
                        <h3 className={styles.productName}>{product.name}</h3>

                        <div className={styles.priceRow}>
                            <span className={styles.discountedPrice}>
                                ${Number(product.discountedPrice).toFixed(2)}
                            </span>
                            <span className={styles.actualPrice}>
                                ${Number(product.actualPrice).toFixed(2)}
                            </span>
                            <span className={styles.discountTag}>
                                -{Math.round(discountPercent)}%
                            </span>
                        </div>

                        <button
                            className={styles.cartButton}
                            onClick={() => handleAddToCart(product.id)}
                        >
                            <BsPlusLg /> Add to Cart
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
