"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import { BsArrowLeft, BsArrowRight, BsPlusLg } from "react-icons/bs";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./styles/products.module.css";
import { Product } from "../types/types";
import ProductsService from "../services/productService";
import LoginModal from "@/app/login/loginModal";
import { useAlert } from "@/components/alert/alertProvider";
import { AxiosError } from "axios";
import { useAuth } from "../lib/authContext";
import { useRouter } from "next/navigation";

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isLoggedIn, login } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const limit = 10;
    const page = 1;

    const { showAlert } = useAlert();
    const sliderRef = useRef<Slider | null>(null);

    const router = useRouter();

    const handleProductClick = (productId: string) => {
        router.push(`/details?id=${productId}`);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await ProductsService.getProducts({ page, limit });
                setProducts(response.data.data.data);
            } catch (err: unknown) {
                if (err instanceof Error) setError(err.message);
                else setError("Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [page]);

    const handleAddToCart = async (productId: string) => {
        if (!isLoggedIn) { // ✅ use context instead of authService
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

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 2,
        swipeToSlide: true,
        speed: 2000,
        autoplaySpeed: 4000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: false,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    dots: false,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: false,
                },
            },
        ],
    };

    if (loading)
        return (
            <div className={styles.loaderWrapper}>
                <div className={styles.loader}></div>
            </div>
        );

    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.carouselWrapper}>
            <div className={styles.topButtons}>
                <button
                    className={styles.iconButton}
                    onClick={() => sliderRef.current?.slickPrev()}
                >
                    <BsArrowLeft />
                </button>
                <button
                    className={styles.iconButton}
                    onClick={() => sliderRef.current?.slickNext()}
                >
                    <BsArrowRight />
                </button>
            </div>

            <div className={styles.carouselContainer}>
                {products.length === 0 ? (
                    <p>No products found.</p>
                ) : (
                    <Slider ref={sliderRef} {...settings}>
                        {products.map((product) => {
                            const mainImage = product.images.find((img) => img.isMain);
                            const discountPercent =
                                ((Number(product.actualPrice) - Number(product.discountedPrice)) /
                                    Number(product.actualPrice)) *
                                100;

                            return (
                                <div key={product.id} className={styles.productCard} onClick={() => handleProductClick(product.id)}>
                                    <div className={styles.imageWrapper}>
                                        {mainImage && (
                                            <Image
                                                src={mainImage.url}
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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToCart(product.id);
                                        }}
                                    >
                                        <BsPlusLg /> Add to Cart
                                    </button>
                                </div>
                            );
                        })}
                    </Slider>
                )}
            </div>

            {/* ✅ Login Modal */}
            {showLoginModal && (
                <LoginModal
                    onClose={() => setShowLoginModal(false)}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}
        </div>
    );
}
