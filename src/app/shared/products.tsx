"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./styles/products.module.css";
import { Product } from "../types/types";
import ProductsService from "../services/productService";

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const limit = 10;

    // ✅ Properly typed reference for react-slick
    const sliderRef = useRef<Slider | null>(null);

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

    const settings = {
        dots: false,
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 700, settings: { slidesToShow: 1 } },
        ],
    };

    if (loading) return <p>Loading products...</p>;
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
                                <div key={product.id} className={styles.productCard}>
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
                                </div>
                            );
                        })}
                    </Slider>
                )}
            </div>
        </div>
    );
}