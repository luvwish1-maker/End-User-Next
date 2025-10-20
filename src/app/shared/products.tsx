"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
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
        <div className={styles.carouselContainer}>
            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <Slider {...settings}>
                    {products.map((product) => {
                        const mainImage = product.images.find(img => img.isMain);
                        return (
                            <div key={product.id} className={styles.productCard}>
                                <div className={styles.imageWrapper}>
                                    {mainImage && (
                                        <Image
                                            src={mainImage.url}
                                            alt={mainImage.altText || product.name}
                                            width={300}
                                            height={300}
                                            className={styles.productImage}
                                        />
                                    )}
                                </div>
                                <h3 className={styles.productName}>{product.name}</h3>
                                <p className={styles.productPrice}>
                                    ${Number(product.discountedPrice).toFixed(2)}
                                </p>
                            </div>
                        );
                    })}
                </Slider>
            )}
        </div>
    );
}
