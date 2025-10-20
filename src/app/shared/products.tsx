"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
                // access the correct nested array from API
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

    if (loading) return <p>Loading products...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.container}>
            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className={styles.productsGrid}>
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
                                            priority={false}
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
                </div>
            )}
        </div>
    );
}
