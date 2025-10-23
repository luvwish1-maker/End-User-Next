"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Product } from "@/app/types/types";
import ProductsService from "../services/productService";

export default function Details() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <p className="text-center my-5">Loading...</p>;
    if (!product) return <p className="text-center my-5">Product not found.</p>;

    const mainImage = product.images?.find((img) => img.isMain)?.url || "";

    return (
        <div className="container my-5">
            <div className="row align-items-center g-5">
                <div className="col-md-6 text-center">
                    {mainImage && (
                        <div className="position-relative mx-auto" style={{ width: "100%", maxWidth: "450px" }}>
                            <Image
                                src={mainImage}
                                alt={product.name}
                                width={450}
                                height={450}
                                priority
                                className="rounded shadow-sm img-fluid"
                                style={{ objectFit: "cover" }}
                            />
                        </div>
                    )}
                </div>

                <div className="col-md-6">
                    <h2 className="mb-3">{product.name}</h2>
                    <p className="text-muted mb-1">Category: {product.categoryName}</p>

                    <p>
                        <span className="text-danger fs-4 fw-bold">
                            ₹{product.discountedPrice}
                        </span>{" "}
                        <del className="text-secondary">₹{product.actualPrice}</del>
                    </p>

                    <p>{product.description}</p>

                    <p className={`fw-semibold ${product.isStock ? "text-success" : "text-danger"}`}>
                        {product.isStock ? `In Stock (${product.stockCount} available)` : "Out of Stock"}
                    </p>

                    <button className="btn btn-primary me-3">Add to Cart</button>
                    <button className="btn btn-outline-danger">Add to Wishlist</button>
                </div>
            </div>
        </div>
    );
}
